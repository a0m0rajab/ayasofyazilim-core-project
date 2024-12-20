"use server";

import { getResourceData } from "src/language-data/TravellerService";
import { getCountriesApi } from "src/app/[lang]/app/actions/LocationService/actions";
import Form from "./form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { languageData } = await getResourceData(params.lang);
  const countries = await getCountriesApi();
  const countryList =
    (countries.type === "success" && countries.data.items) || [];

  return (
    <Form
      countryList={{
        data: countryList,
        success: countries.type === "success",
      }}
      languageData={languageData}
    />
  );
}
