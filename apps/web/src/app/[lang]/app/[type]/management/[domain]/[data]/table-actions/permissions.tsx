"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import type {
  Volo_Abp_PermissionManagement_PermissionGrantInfoDto,
  Volo_Abp_PermissionManagement_PermissionGroupDto,
  Volo_Abp_PermissionManagement_UpdatePermissionDto,
} from "@ayasofyazilim/saas/AdministrationService";
import Progress from "@repo/ayasofyazilim-ui/molecules/progress";
import {
  SectionLayout,
  SectionLayoutContent,
} from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useCallback, useEffect, useState } from "react";
import { getPermissionsApi } from "src/app/[lang]/app/actions/AdministrationService/actions";
import { putPermissionsApi } from "src/app/[lang]/app/actions/AdministrationService/put-actions";
import { getResourceDataClient } from "src/language-data/IdentityService";

type NormalizedPermissionGroup = Omit<
  Volo_Abp_PermissionManagement_PermissionGroupDto,
  "permissions"
> & {
  permissions: Volo_Abp_PermissionManagement_PermissionGrantInfoDto[];
};

export default function PermissionsComponent({
  rowId,
  params,
  roleName,
  setIsOpen,
}: {
  rowId: string;
  params: {
    lang: string;
    data: string;
  };
  roleName: string;
  setIsOpen?: (e: boolean) => void;
}) {
  const languageData = getResourceDataClient(params.lang);
  const [permissionsData, setPermissionsData] = useState<
    NormalizedPermissionGroup[]
  >([]);
  const [updatedPermissionsData, setUpdatedPermissionsData] = useState<
    Volo_Abp_PermissionManagement_UpdatePermissionDto[]
  >([]);
  const [loadingError, setLoadingError] = useState(false);
  const isUserPage = params.data === "user";
  const providerKey = isUserPage ? rowId : roleName;
  const providerName = isUserPage ? "U" : "R";

  useEffect(() => {
    const fetchPermissions = async () => {
      const response = await getPermissionsApi({ providerKey, providerName });
      if (response.type === "success") {
        const normalizedGroups =
          response.data.groups?.map((group) => ({
            ...group,
            permissions: group.permissions ?? [],
          })) || [];
        setPermissionsData(normalizedGroups);
      } else {
        setLoadingError(true);
        toast.error(
          `${response.status}: ${response.message || languageData["Permissions.Get.Fail"]}`,
        );
      }
    };
    void fetchPermissions();
  }, [rowId, roleName, isUserPage, params.lang]);

  const handleUpdatePermissions = async () => {
    const response = await putPermissionsApi({
      providerKey,
      providerName,
      requestBody: { permissions: updatedPermissionsData },
    });
    if (response.type === "success") {
      toast.success(
        response.message || languageData["Permissions.Update.Success"],
      );
      setIsOpen && setIsOpen(false);
    } else {
      toast.error(
        `${response.status}: ${response.message || languageData["Permissions.Update.Fail"]}`,
      );
    }
  };

  const isRoleManaged = useCallback(
    (permission: Volo_Abp_PermissionManagement_PermissionGrantInfoDto) => {
      return (
        isUserPage &&
        permission.grantedProviders?.some(
          (provider) => provider.providerName === "R",
        )
      );
    },
    [isUserPage],
  );

  const permissionChange = (permissionName: string, isGranted: boolean) => {
    setUpdatedPermissionsData((prev) => {
      const updated = [...prev];
      const existingIndex = updated.findIndex((p) => p.name === permissionName);
      if (existingIndex >= 0) {
        updated[existingIndex].isGranted = isGranted;
      } else {
        updated.push({ name: permissionName, isGranted });
      }
      return updated;
    });
  };

  const togglePermission = useCallback(
    (groupName: string, permissionName: string) => {
      setPermissionsData((prev) =>
        prev.map((group) => {
          if (group.name !== groupName) return group;

          const updatedPermissions = group.permissions.map((permission) => {
            if (
              permission.name === permissionName &&
              !isRoleManaged(permission)
            ) {
              const newGrant = !permission.isGranted;
              permissionChange(permissionName, newGrant);
              if (newGrant) {
                permissionState(
                  groupName,
                  permission.parentName || "",
                  true,
                  "parent",
                );
              } else {
                permissionState(groupName, permissionName, false, "child");
              }
              return { ...permission, isGranted: newGrant };
            }
            return permission;
          });
          return { ...group, permissions: updatedPermissions };
        }),
      );
    },
    [isRoleManaged],
  );

  const permissionState = (
    groupName: string,
    permissionName: string,
    isGranted: boolean,
    type: "parent" | "child",
  ) => {
    setPermissionsData((prev) =>
      prev.map((group) => {
        if (group.name !== groupName) return group;
        const updatedPermissions = group.permissions.map((permission) => {
          const relevant =
            type === "child"
              ? permission.parentName === permissionName
              : permission.name === permissionName;
          if (relevant && !isRoleManaged(permission)) {
            permissionChange(permission.name || "", isGranted);
            if (type === "parent" && permission.parentName) {
              permissionState(
                groupName,
                permission.parentName,
                isGranted,
                "parent",
              );
            }
            if (type === "child") {
              permissionState(
                groupName,
                permission.name || "",
                isGranted,
                "child",
              );
            }
            return { ...permission, isGranted };
          }
          return permission;
        });
        return { ...group, permissions: updatedPermissions };
      }),
    );
  };

  const toggleGroupPermissions = (groupName: string, isGranted: boolean) => {
    setPermissionsData((prev) =>
      prev.map((group) => {
        if (group.name !== groupName) return group;
        const updatedPermissions = group.permissions.map((permission) => {
          if (!isRoleManaged(permission)) {
            permissionChange(permission.name || "", isGranted);
            return { ...permission, isGranted };
          }
          return permission;
        });
        return { ...group, permissions: updatedPermissions };
      }),
    );
  };

  const toggleAllPermissions = (isGranted: boolean) => {
    setPermissionsData((prev) =>
      prev.map((group) => ({
        ...group,
        permissions: group.permissions.map((permission) => {
          if (!isRoleManaged(permission)) {
            permissionChange(permission.name || "", isGranted);
            return { ...permission, isGranted };
          }
          return permission;
        }),
      })),
    );
  };

  const renderPermissions = useCallback(
    (groupName: string, parentName: string | null) => {
      const group = permissionsData.find((g) => g.name === groupName);
      if (!group) return null;
      const permissions = group.permissions.filter(
        (p) => p.parentName === parentName,
      );
      return (
        <div className={parentName ? "ml-8" : ""}>
          {permissions.map((permission) => {
            const disabled = isRoleManaged(permission);
            return (
              <div className="mb-2 gap-2" key={permission.name}>
                <Checkbox
                  checked={permission.isGranted || false}
                  className="mr-2"
                  disabled={disabled}
                  onCheckedChange={() => {
                    togglePermission(groupName, permission.name || "");
                  }}
                />
                <span>{permission.displayName}</span>
                {renderPermissions(groupName, permission.name || null)}
              </div>
            );
          })}
        </div>
      );
    },
    [permissionsData, togglePermission, isRoleManaged],
  );

  if (!permissionsData.length) {
    return (
      <Progress value={100} variant={loadingError ? "error" : "success"} />
    );
  }

  return (
    <div className="relative flex h-screen flex-col justify-between pb-20">
      <div className="mt-4 flex items-center gap-2 pb-2">
        <Checkbox
          checked={permissionsData.every((group) =>
            group.permissions.every((p) => p.isGranted),
          )}
          disabled={permissionsData.every((group) =>
            group.permissions.every((p) => isRoleManaged(p)),
          )}
          onCheckedChange={(checked) => {
            toggleAllPermissions(checked === true);
          }}
        />
        <span>{languageData["Grant.All.Permissions"]}</span>
      </div>

      <SectionLayout
        sections={permissionsData.map((group) => ({
          name: `${group.displayName} (${group.permissions.filter((p) => p.isGranted).length})`,
          id: group.name || "",
        }))}
        vertical
      >
        {permissionsData.map((group) => (
          <SectionLayoutContent key={group.name} sectionId={group.name || ""}>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={group.permissions.every((p) => p.isGranted)}
                disabled={group.permissions.every((p) => isRoleManaged(p))}
                onCheckedChange={(checked) => {
                  toggleGroupPermissions(group.name || "", checked === true);
                }}
              />
              <span>{languageData["Select.All"]}</span>
            </div>
            <div className="my-2 border-t border-gray-200" />
            {renderPermissions(group.name || "", null)}
          </SectionLayoutContent>
        ))}
      </SectionLayout>
      <div className="bottom-0 left-0 flex w-full justify-end bg-white p-4 shadow-md">
        <Button onClick={() => void handleUpdatePermissions()}>
          {languageData["Edit.Save"]}
        </Button>
      </div>
    </div>
  );
}