"use server";

import type { GetApiTravellerServiceTravellersData } from "@ayasofyazilim/saas/TravellerService";
import { notFound } from "next/navigation";
import PagePolicy from "src/app/[lang]/page-policy/page-policy";
import { getResourceData } from "src/language-data/TravellerService";
import { getCountriesApi } from "../../../actions/LocationService/actions";
import { getTravellersApi } from "../../../actions/TravellerService/actions";
import TravellersTable from "./table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  name?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  travelDocumentNumber?: string;
  username?: string;
  nationalities?: string;
  residences?: string;
  showExpired?: boolean;
}

export default async function Page(props: {
  params: { lang: string };
  searchParams?: Promise<SearchParamType>;
}) {
  const searchParams = await props.searchParams;
  const countries = await getCountriesApi();
  const countryList =
    (countries.type === "success" && countries.data.items) || [];
  const response = await getTravellersApi({
    ...searchParams,
    nationalities: searchParams?.nationalities?.split(",") || [],
    residences: searchParams?.residences?.split(",") || [],
  } as GetApiTravellerServiceTravellersData);

  if (response.type !== "success") return notFound();

  const { languageData } = await getResourceData(props.params.lang);
  return (
    <PagePolicy requiredPolicies={["CRMService.TaxOffices"]}>
      <TravellersTable
        countryList={countryList}
        languageData={languageData}
        response={response.data}
      />
    </PagePolicy>
  );
}
