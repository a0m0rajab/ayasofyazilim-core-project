import type { NavbarItemsFromDB } from "@repo/ui/theme/types";
import type { Session } from "next-auth";
import type { AbpUiNavigationResource } from "src/language-data/AbpUiNavigation";
import { unirefundNavbarDataFromDB } from "./projects/unirefund";
import { ayshopgoNavbarDataFromDB } from "./projects/ayshopgo";
import { tahsiletNavbarDataFromDB } from "./projects/tahsilet";

const dbData = {
  UNIREFUND: unirefundNavbarDataFromDB,
  UPWITHCROWD: unirefundNavbarDataFromDB,
  TAHSILET: tahsiletNavbarDataFromDB,
  AYSHOPGO: ayshopgoNavbarDataFromDB,
};

function buildItemHref(prefix: string, item: NavbarItemsFromDB) {
  return item.href ? `${prefix}/${item.href}` : null;
}

function buildParentKey(prefix: string, item: NavbarItemsFromDB) {
  return item.parentNavbarItemKey === "/"
    ? prefix
    : `${prefix}/${item.parentNavbarItemKey}`;
}

function buildItemKey(prefix: string, item: NavbarItemsFromDB) {
  return item.key && item.key !== "/" ? `${prefix}/${item.key}` : prefix;
}

function getDescription(
  item: NavbarItemsFromDB,
  languageData: AbpUiNavigationResource,
) {
  const descriptionKey =
    `${item.displayName}.Description` as keyof typeof languageData;
  return languageData[descriptionKey] || "No description";
}

function processPolicies(item: NavbarItemsFromDB, session: Session | null) {
  if (item.requiredPolicies) {
    const missingPolicies = item.requiredPolicies.filter(
      (policy) => !session?.grantedPolicies?.[policy],
    );
    if (missingPolicies.length > 0) {
      item.hidden = true;
    }
  }
}

function processNavbarItems(
  items: NavbarItemsFromDB[],
  prefix: string,
  session: Session | null,
  languageData: AbpUiNavigationResource,
) {
  return items.map((item) => {
    processPolicies(item, session);

    item.href = buildItemHref(prefix, item);
    item.parentNavbarItemKey = buildParentKey(prefix, item);
    item.key = buildItemKey(prefix, item);

    item.displayName =
      languageData[item.displayName as keyof typeof languageData] ||
      `**${item.displayName}`;
    item.description = getDescription(item, languageData);

    return item;
  });
}

function checkForChildLink(
  item: NavbarItemsFromDB,
  filteredItems: NavbarItemsFromDB[],
): string | null {
  if (item.href) {
    return item.href;
  }
  const isVisibleChild = filteredItems.find(
    (i) => i.parentNavbarItemKey === item.key,
  );

  if (!isVisibleChild) {
    item.hidden = true;
    return null;
  }

  if (isVisibleChild.href) {
    item.href = isVisibleChild.href;
    return item.href;
  }

  const childHref = checkForChildLink(isVisibleChild, filteredItems);
  if (!childHref) {
    item.hidden = true;
  } else {
    item.href = childHref;
  }
  return item.href;
}

export function getNavbarFromDB(
  prefix: string,
  languageData: AbpUiNavigationResource,
  appName: string,
  session: Session | null,
) {
  const navbarDataFromDB: NavbarItemsFromDB[] = JSON.parse(
    JSON.stringify(dbData[appName as keyof typeof dbData]),
  ) as NavbarItemsFromDB[];

  const processedItems = processNavbarItems(
    navbarDataFromDB,
    prefix,
    session,
    languageData,
  );

  const filteredItems = processedItems.filter((item) => !item.hidden);

  filteredItems
    .filter((item) => item.href === null)
    .forEach((item) => {
      checkForChildLink(item, filteredItems);
    });

  return filteredItems.filter((item) => !item.hidden);
}
