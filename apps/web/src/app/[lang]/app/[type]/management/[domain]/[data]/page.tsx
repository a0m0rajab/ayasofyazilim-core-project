/* eslint-disable no-await-in-loop, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument -- TODO: we need to fix this*/
"use client";
import { toast } from "@/components/ui/sonner";
import type { SchemaType } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import jsonToCSV from "@repo/ayasofyazilim-ui/lib/json-to-csv";
import type {
  ColumnsType,
  fetchRequestProps,
  TableAction,
} from "@repo/ayasofyazilim-ui/molecules/tables/types";
import {
  createFieldConfigWithResource,
  mergeFieldConfigs,
  type AutoFormProps,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import Dashboard from "@repo/ayasofyazilim-ui/templates/dashboard";
import type { FormModifier, TableData } from "@repo/ui/utils/table/table-utils";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getResourceDataClient } from "src/language-data/IdentityService";
import { createZodObject, getBaseLink } from "src/utils";
import { dataConfig } from "../../data.tsx";
import Claims from "./table-actions/claims";
import SessionsComponent from "./table-actions/sessions.tsx";
import PermissionsComponent from "./table-actions/permissions.tsx";

async function controlledFetch(
  url: string,
  options: RequestInit,
  onSuccess: (_data?: any) => void,
  successMessage = "Successful",
  showToast = true,
) {
  try {
    const getData = await fetch(url, options);
    if (!getData.ok) {
      const body = await getData.json();
      toast.error(body.message);
    } else {
      const data = await getData.json();
      onSuccess(data);
      showToast && toast.success(successMessage);
    }
  } catch (error) {
    toast.error(`Fetch error: ${String(error)}`);
  }
}

function convertEnumField(
  value: string | number,
  enumArray: {
    data: string[];
    type: "enum";
  },
): string | number {
  const data = enumArray.data;
  if (typeof value === "number") {
    return data[value];
  }
  return data.indexOf(value);
}

interface ConvertorValue {
  covertTo?: string;
  data: any;
  get: string;
  post: string;
  type: "enum" | "async";
}

function convertAsyncField(value: any, ConvertorValue: ConvertorValue) {
  if (typeof ConvertorValue.data === "function") {
    return;
  }
  const returnValue = ConvertorValue.data.find((item: any) => {
    return item[ConvertorValue.get] === value;
  });
  if (returnValue) {
    return returnValue[ConvertorValue.post];
  }
}

export default function Page({
  params,
}: {
  params: { data: string; domain: string; lang: string };
}): JSX.Element {
  const languageData = getResourceDataClient(params.lang);
  const fetchLink = getBaseLink(`/api/admin/${params.data}`);
  const [roles, setRoles] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<TableData>(
    dataConfig[params.domain].pages[params.data],
  );
  const detailedFilters =
    dataConfig[params.domain].pages[params.data].detailedFilters || [];
  async function processConvertors() {
    const tempData = { ...formData };
    const schemas = ["createFormSchema", "editFormSchema"] as const;

    for (const schema of schemas) {
      const dataConvertors = tempData[schema]?.convertors;
      if (dataConvertors) {
        for (const [key, value] of Object.entries(dataConvertors)) {
          if (value.type === "async" && typeof value.data === "function") {
            try {
              const tempValue = await value.data();
              if (dataConvertors[key]) {
                dataConvertors[key].data = tempValue;
                dataConvertors[key].type = "async";
              }
            } catch (error) {
              toast.error(`Feild to fetch ${`${key} ${value}`} data`);
            }
          }
        }
      }
    }
    setFormData(tempData);
  }

  function getRoles({ page: _page, filter: _filter }: fetchRequestProps) {
    let page = _page;
    const filter = JSON.stringify(_filter) || "";
    if (typeof page !== "number") {
      page = 0;
    }

    const _fetchLink = `${fetchLink}?page=${page}&filter=${filter}`;
    setIsLoading(true);
    function onData(data: any) {
      let returnData = data;
      if (!data?.items) {
        returnData = {
          totalCount: data.length,
          items: data,
        };
      }
      const dataConvertors = formData.tableSchema.convertors;
      let transformedData = returnData.items;
      if (dataConvertors) {
        transformedData = returnData.items.map((item: any) => {
          const returnObject = { ...item };
          Object.entries(dataConvertors).forEach(([key, value]) => {
            if (value.type === "enum") {
              returnObject[key] = convertEnumField(returnObject[key], value);
            }
            if (value.type === "async") {
              returnObject[key] = returnObject[value.covertTo];
            }
          });
          return returnObject;
        });
      }
      setRoles({ ...returnData, items: transformedData });
      setIsLoading(false);
    }
    void controlledFetch(
      _fetchLink,
      {
        method: "GET",
      } as RequestInit,
      onData,
      "",
      false,
    );
  }
  const translatedForm = createFieldConfigWithResource({
    schema: formData.createFormSchema?.schema as SchemaType,
    resources: languageData,
  });
  const createFormSchema = formData.createFormSchema;
  let action: TableAction[] | undefined;
  if (createFormSchema) {
    action = [
      {
        cta: languageData[
          `${formData.title?.replaceAll(" ", "")}.New` as keyof typeof languageData
        ],
        componentType: "Autoform",
        description:
          languageData[
            `${formData.title?.replaceAll(" ", "")}.New` as keyof typeof languageData
          ],
        autoFormArgs: {
          formSchema: createZodObject(
            createFormSchema.schema,
            createFormSchema.formPositions || [],
            createFormSchema.convertors || {},
          ),
          dependencies: createFormSchema.dependencies,
          fieldConfig: mergeFieldConfigs(translatedForm, {
            all: {
              withoutBorder: true,
            },
          }),
          submit: {
            cta: languageData.Save,
          },
        },
        callback: (e) => {
          const transformedData = parseFormValues(createFormSchema, e);
          void controlledFetch(
            fetchLink,
            {
              method: "POST",
              body: JSON.stringify(transformedData),
            },
            getRoles,
            "Added Successfully",
          );
        },
        type: "Dialog",
      },
      {
        cta: `Export CSV`,
        callback: () => {
          jsonToCSV(roles, params.data);
        },
        type: "Action",
      },
    ];
  }

  useEffect(() => {
    void processConvertors();
  }, []);

  function parseFormValues(schema: FormModifier, data: any) {
    const newSchema = createZodObject(
      schema.schema,
      schema.formPositions || [],
      schema.convertors || {},
    );
    if (!schema.convertors) return newSchema.parse(data);
    const transformedSchema = newSchema.transform((val) => {
      const returnObject = { ...val };
      if (!schema.convertors) return returnObject;
      Object.entries(schema.convertors).forEach(([key, value]) => {
        if (value.type === "enum") {
          returnObject[key] = convertEnumField(returnObject[key], value);
        } else if (value.type === "async") {
          returnObject[key] = convertAsyncField(returnObject[key], value);
        }
      });
      return returnObject;
    });
    const parsed = transformedSchema.parse(data);
    return parsed;
  }

  const onEdit = (data: any, row: any, editFormSchema: any) => {
    const parsedData = parseFormValues(editFormSchema, data);
    void controlledFetch(
      fetchLink,
      {
        method: "PUT",
        body: JSON.stringify({
          id: row.id,
          requestBody: JSON.stringify(parsedData),
        }),
      },
      getRoles,
      "Updated Successfully",
    );
  };

  const onDelete = (row: any) => {
    void controlledFetch(
      fetchLink,
      {
        method: "DELETE",
        body: JSON.stringify(row.id),
      },
      getRoles,
      "Deleted Successfully",
    );
  };

  function convertZod(schema: FormModifier) {
    const newSchema = createZodObject(
      schema.schema,
      schema.formPositions || [],
      schema.convertors || {},
    );
    return newSchema;
  }
  const editFormSchema = formData.editFormSchema;
  let editFormSchemaZod,
    autoformEditArgs: AutoFormProps = {
      formSchema: z.object({}),
    };
  if (editFormSchema) {
    editFormSchemaZod = convertZod(editFormSchema);
    autoformEditArgs = {
      formSchema: editFormSchemaZod,
      dependencies: formData.editFormSchema?.dependencies,
      // convertor: formData.tableSchema.convertors,
      fieldConfig: mergeFieldConfigs(translatedForm, {
        all: {
          withoutBorder: true,
        },
      }),
    };
  }
  let actionList: TableAction[] = [];
  if (formData.tableSchema.actionList) {
    actionList = formData.tableSchema.actionList(controlledFetch, getRoles);
  }
  const columnsData: ColumnsType = {
    type: "Auto",
    data: {
      tableType: formData.tableSchema.schema,
      excludeList: formData.tableSchema.excludeList || [],
      actionList,
    },
  };

  columnsData.data.actionList?.push({
    cta: languageData.Delete,
    type: "Dialog",
    componentType: "ConfirmationDialog",
    description: `${languageData["Delete.Assurance"]} ${formData.title}?`,
    cancelCTA: languageData.Cancel,
    variant: "destructive",
    callback: (data) => {
      onDelete(data);
    },
  });
  columnsData.data.actionList?.push({
    cta: languageData.Edit,
    description: languageData.Edit,
    type: "Dialog",
    componentType: "Autoform",
    autoFormArgs: {
      ...autoformEditArgs,
      submit: {
        cta: languageData["Edit.Save"],
      },
    },
    callback: (data, row) => {
      onEdit(data, row, editFormSchema);
    },
  });

  const claimComponent = async (
    row: { id: string },
    setIsOpen?: (e: boolean) => void,
  ) => {
    await Promise.resolve();
    return <Claims params={params} rowId={row.id} setIsOpen={setIsOpen} />;
  };
  if (params.data === "role" || params.data === "user") {
    columnsData.data.actionList?.push({
      type: "Dialog",
      cta: languageData.Claims,
      loadingContent: <>Loading...</>,
      description: languageData["Claim.Add.Description"],
      componentType: "CustomComponent",
      customComponentRendering: (setIsOpen) => claimComponent(setIsOpen),
      content: <></>,
    });
  }
  const session = async (row: { id: string }) => {
    await Promise.resolve();
    return <SessionsComponent lang={params.lang} rowId={row.id} />;
  };
  if (params.data === "user") {
    columnsData.data.actionList?.push({
      type: "Sheet",
      cta: languageData["User.Sessions"],
      loadingContent: <>Loading...</>,
      description: languageData["User.Sessions.Description"],
      componentType: "CustomComponent",
      customComponentRendering: session,
      content: <></>,
    });
  }
  const permissions = async (
    row: { id: string },
    roleName: string,
    setIsOpen?: (e: boolean) => void,
  ) => {
    await Promise.resolve();
    return (
      <PermissionsComponent
        params={params}
        roleName={roleName}
        rowId={row.id}
        setIsOpen={setIsOpen}
      />
    );
  };

  if (params.data === "user" || params.data === "role") {
    columnsData.data.actionList?.push({
      type: "Sheet",
      cta: languageData.Permissions,
      loadingContent: <>Loading...</>,
      description: languageData["Permissions.Description"],
      componentType: "CustomComponent",
      customComponentRendering: (row, setIsOpen) =>
        permissions(row, row.name as string, setIsOpen),
      content: <></>,
    });
  }

  return (
    <Dashboard
      action={action}
      cards={[]}
      columnsData={columnsData}
      data={roles?.items}
      detailedFilter={detailedFilters}
      fetchRequest={getRoles}
      isLoading={isLoading}
      rowCount={roles?.totalCount || 0}
      withCards={false}
      withTable
    />
  );
}
