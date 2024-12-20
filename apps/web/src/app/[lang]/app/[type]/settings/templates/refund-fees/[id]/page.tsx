import { notFound } from "next/navigation";
import { getRefundFeeHeadersByIdApi } from "src/app/[lang]/app/actions/ContractService/action";
import { getResourceData } from "src/language-data/ContractService";
import Form from "./form";
import RefundFeeDetailsForm from "./table";

export default async function Page({
  params,
}: {
  params: { lang: string; id: string };
}): Promise<JSX.Element> {
  const response = await getRefundFeeHeadersByIdApi({ id: params.id });
  if (response.type !== "success") return notFound();

  const { languageData } = await getResourceData(params.lang);

  return (
    <>
      <Form languageData={languageData} response={response.data} />
      <RefundFeeDetailsForm
        languageData={languageData}
        response={response.data}
      />
      <div className="hidden" id="page-title">
        {response.data.name}
      </div>
      <div className="hidden" id="page-description">
        {languageData["RefundTables.Edit.Description"]}
      </div>
    </>
  );
}
