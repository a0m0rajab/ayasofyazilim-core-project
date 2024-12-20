"use server";

import { getTaxOfficesApi } from "src/app/[lang]/app/actions/CrmService/actions";
import { getResourceData } from "src/language-data/CRMService";
import { getCountriesApi } from "../../../../actions/LocationService/actions";
import type { PartyNameType } from "../../types";
import PageClientSide from "./page-client";

export default async function Page({
  params,
}: {
  params: {
    partyName: Exclude<PartyNameType, "individuals">;
    lang: string;
  };
}) {
  const { languageData } = await getResourceData(params.lang);

  const countries = await getCountriesApi();
  const countryList =
    (countries.type === "success" && countries.data.items) || [];

  const taxOffices = await getTaxOfficesApi();
  const taxOfficeList =
    (taxOffices.type === "success" && taxOffices.data.items) || [];

  return (
    <PageClientSide
      countryList={countryList}
      languageData={languageData}
      partyName={params.partyName}
      taxOfficeList={taxOfficeList}
    />
  );
}
