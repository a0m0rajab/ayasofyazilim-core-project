import type { NavbarItemsFromDB } from "@repo/ui/theme/types";

export const management: NavbarItemsFromDB[] = [
  {
    key: "management",
    displayName: "Management",
    description: "View and manage your management settings.",
    href: null,
    icon: "management",
    parentNavbarItemKey: "/",
    displayOrder: 1,
  },
  {
    key: "management/openiddict",
    displayName: "OpenIdDict",
    description: "Manage Open ID dict settings.",
    href: null,
    icon: "id",
    parentNavbarItemKey: "management",
    displayOrder: 1,
    requiredPolicies: ["UniRefund.Settings"],
  },
  {
    key: "management/openiddict/applications",
    displayName: "Applications",
    description: "Manage applications within Open Id Dict.",
    href: "management/openiddict/applications",
    icon: "app",
    parentNavbarItemKey: "management/openiddict",
    displayOrder: 1,
    requiredPolicies: ["UniRefund.Settings"],
  },
  {
    key: "management/openiddict/scopes",
    displayName: "Scopes",
    description: "View and manage scopes for Open Id Dict.",
    href: "management/openiddict/scopes",
    icon: "scope",
    parentNavbarItemKey: "management/openiddict",
    displayOrder: 1,
    requiredPolicies: ["UniRefund.Settings"],
  },
  {
    key: "management/admin",
    displayName: "Admin",
    description: "Access administrative tools and settings.",
    href: null,
    icon: "management",
    parentNavbarItemKey: "management",
    displayOrder: 1,
    requiredPolicies: ["UniRefund.Settings"],
  },
  {
    key: "management/admin/languages",
    displayName: "Languages",
    description: "Manage language settings and translations.",
    href: "management/admin/languages",
    icon: "language",
    parentNavbarItemKey: "management/admin",
    displayOrder: 1,
    requiredPolicies: ["LanguageManagement.Languages"],
  },
  {
    key: "management/admin/language-texts",
    displayName: "LanguageTexts",
    description: "Edit and review language texts.",
    href: "management/admin/language-texts",
    icon: "book",
    parentNavbarItemKey: "management/admin",
    displayOrder: 1,
    requiredPolicies: ["LanguageManagement.LanguageTexts"],
  },
  {
    key: "management/saas",
    displayName: "Saas",
    description: "Manage SaaS configurations and settings.",
    href: null,
    icon: "management",
    parentNavbarItemKey: "management",
    displayOrder: 1,
    requiredPolicies: ["UniRefund.Settings"],
  },
  {
    key: "management/saas/edition",
    displayName: "Edition",
    description: "Manage SaaS editions and plans.",
    href: "management/saas/edition",
    icon: "edition",
    parentNavbarItemKey: "management/saas",
    displayOrder: 1,
    requiredPolicies: ["UniRefund.Settings"],
  },
  {
    key: "management/saas/tenant",
    displayName: "Tenant",
    description: "Manage SaaS tenant settings and configurations.",
    href: "management/saas/tenant",
    icon: "globe",
    parentNavbarItemKey: "management/saas",
    displayOrder: 1,
    requiredPolicies: ["UniRefund.Dashboard.Tenant"],
  },
  {
    key: "management/identity",
    displayName: "Identity",
    description: "Manage user identities and roles.",
    href: null,
    icon: "management",
    parentNavbarItemKey: "management",
    displayOrder: 1,
    requiredPolicies: ["UniRefund.Settings"],
  },
  {
    key: "management/identity/role",
    displayName: "Role",
    description: "Manage user roles and permissions.",
    href: "management/identity/role",
    icon: "role",
    parentNavbarItemKey: "management/identity",
    displayOrder: 1,
    requiredPolicies: ["AbpIdentity.Roles"],
  },
  {
    key: "management/identity/user",
    displayName: "User",
    description: "Manage user accounts and profiles.",
    href: "management/identity/user",
    icon: "identity",
    parentNavbarItemKey: "management/identity",
    displayOrder: 1,
    requiredPolicies: ["AbpIdentity.Users"],
  },
  {
    key: "management/identity/claim-type",
    displayName: "ClaimType",
    description: "Manage claim types for user identities.",
    href: "management/identity/claim-type",
    icon: "scan",
    parentNavbarItemKey: "management/identity",
    displayOrder: 1,
    requiredPolicies: ["AbpIdentity.Roles"],
  },
  {
    key: "management/identity/security-logs",
    displayName: "SecurityLogs",
    description: "View security logs and audit trails.",
    href: "management/identity/security-logs",
    icon: "lock",
    parentNavbarItemKey: "management/identity",
    displayOrder: 1,
    requiredPolicies: ["AbpIdentity.SecurityLogs"],
  },
  {
    key: "management/identity/organization",
    displayName: "Organization",
    description: "Manage organizational settings and structure.",
    href: "management/identity/organization",
    icon: "building",
    parentNavbarItemKey: "management/identity",
    displayOrder: 1,
    requiredPolicies: ["AbpIdentity.OrganizationUnits"],
  },
  {
    key: "management/audit-logs/audit-logs",
    displayName: "AuditLogs",
    description: "View and analyze audit logs.",
    href: "management/audit-logs/audit-logs",
    icon: "log",
    parentNavbarItemKey: "management",
    displayOrder: 1,
    requiredPolicies: ["AuditLogging.AuditLogs"],
  },
  {
    key: "management/text-templates/text-templates",
    displayName: "TextTemplates",
    description: "Manage and create text templates.",
    href: "management/text-templates/text-templates",
    icon: "text",
    parentNavbarItemKey: "management",
    displayOrder: 1,
    requiredPolicies: ["LanguageManagement.LanguageTexts"],
  },
];
export const settings: NavbarItemsFromDB[] = [
  {
    key: "settings",
    displayName: "Settings",
    description: "Access settings settings and tools.",
    href: null,
    icon: "settings",
    parentNavbarItemKey: "/",
    displayOrder: 1,
  },
  {
    key: "settings/product",
    displayName: "Product",
    description: "Configure VAT settings and rules.",
    href: null,
    icon: "settings",
    parentNavbarItemKey: "settings",
    displayOrder: 1,
  },
  {
    key: "settings/product/vats",
    displayName: "VAT",
    description: "Manage VAT settings and rates.",
    href: "settings/product/vats",
    icon: "vat",
    parentNavbarItemKey: "settings/product",
    displayOrder: 1,
    requiredPolicies: ["SettingService.Vats"],
  },
  {
    key: "settings/product/product-groups",
    displayName: "ProductGroup",
    description: "Manage product groups and categories.",
    href: "settings/product/product-groups",
    icon: "product",
    parentNavbarItemKey: "settings/product",
    displayOrder: 1,
    requiredPolicies: ["SettingService.ProductGroupVats"],
  },
  {
    key: "settings/tenant",
    displayName: "Tenant",
    description: "Manage settings for tenants.",
    href: "settings/tenant",
    icon: "settings",
    parentNavbarItemKey: "settings",
    displayOrder: 1,
    requiredPolicies: ["UniRefund.Dashboard.Tenant"],
  },
  {
    key: "settings/templates",
    displayName: "Templates",
    description: "Manage templates.",
    href: null,
    icon: "layer",
    parentNavbarItemKey: "settings",
    displayOrder: 1,
  },
  {
    key: "settings/templates/refund-fees",
    displayName: "RefundFees",
    description: "Manage refund fees",
    href: "settings/templates/refund-fees",
    icon: "settings",
    parentNavbarItemKey: "settings/templates",
    displayOrder: 1,
    requiredPolicies: ["ContractService.RefundFeeHeader"],
  },
  {
    key: "settings/templates/refund-tables",
    displayName: "RefundTables",
    description: "Manage refund tables",
    href: "settings/templates/refund-tables",
    icon: "settings",
    parentNavbarItemKey: "settings/templates",
    displayOrder: 1,
    requiredPolicies: ["ContractService.RefundTableHeader"],
  },
  {
    key: "settings/templates/rebate",
    displayName: "Rebate",
    description: "Manage rebate",
    href: "settings/templates/rebate",
    icon: "settings",
    parentNavbarItemKey: "settings/templates",
    displayOrder: 1,
    requiredPolicies: ["ContractService.RebateSetting"],
  },
];
export const parties: NavbarItemsFromDB[] = [
  {
    key: "parties",
    displayName: "Parties",
    description: "Manage customer relationship management settings.",
    href: null,
    icon: "layer",
    parentNavbarItemKey: "/",
    displayOrder: 1,
  },
  {
    key: "parties/merchants",
    displayName: "Merchants",
    description: "Manage merchant accounts and details.",
    href: "parties/merchants?typeCode=HEADQUARTER",
    icon: "shop",
    parentNavbarItemKey: "parties",
    displayOrder: 1,
    requiredPolicies: ["CRMService.Merchants"],
  },
  {
    key: "parties/refund-points",
    displayName: "RefundPoints",
    description: "Manage refund points and settings.",
    href: "parties/refund-points",
    icon: "refund",
    parentNavbarItemKey: "parties",
    displayOrder: 1,
    requiredPolicies: ["CRMService.RefundPoints"],
  },
  {
    key: "parties/customs",
    displayName: "Customs",
    description: "Manage customs settings and configurations.",
    href: "parties/customs",
    icon: "container",
    parentNavbarItemKey: "parties",
    displayOrder: 1,
    requiredPolicies: ["CRMService.Customs"],
  },
  {
    key: "parties/tax-free",
    displayName: "TaxFree",
    description: "Manage tax-free settings and exemptions.",
    href: "parties/tax-free",
    icon: "tax",
    parentNavbarItemKey: "parties",
    displayOrder: 1,
    requiredPolicies: ["CRMService.TaxFrees"],
  },
  {
    key: "parties/tax-offices",
    displayName: "TaxOffices",
    description: "Manage tax office details and settings.",
    href: "parties/tax-offices",
    icon: "taxOffice",
    parentNavbarItemKey: "parties",
    displayOrder: 1,
    requiredPolicies: ["CRMService.TaxOffices"],
  },
  {
    key: "parties/individuals",
    displayName: "Individuals",
    description: "Manage individuals.",
    href: "parties/individuals",
    icon: "user",
    parentNavbarItemKey: "parties",
    displayOrder: 1,
    requiredPolicies: ["CRMService.Individuals"],
  },
  {
    key: "parties/travellers",
    displayName: "Traveller",
    description: "Manage traveller-related settings.",
    href: "parties/travellers",
    icon: "plane",
    parentNavbarItemKey: "parties",
    displayOrder: 1,
    requiredPolicies: ["TravellerService.Travellers"],
  },
];
export const operations: NavbarItemsFromDB[] = [
  {
    key: "operations",
    displayName: "Operations",
    description: "Access and manage operational settings.",
    href: null,
    icon: "operation",
    parentNavbarItemKey: "/",
    displayOrder: 1,
  },
  {
    key: "operations/details",
    displayName: "TaxFreeTags",
    description: "Manage tax-free tags and settings.",
    href: "operations/details",
    icon: "dashboard",
    parentNavbarItemKey: "operations",
    displayOrder: 1,
    requiredPolicies: ["TagService.Tags"],
  },
  {
    key: "operations/export-validation",
    displayName: "ExportValidation",
    description: "Manage export validation settings.",
    href: "operations/export-validation",
    icon: "tax",
    parentNavbarItemKey: "operations",
    displayOrder: 1,
    requiredPolicies: ["ExportValidationService.ExportValidations"],
  },
];
export const finance: NavbarItemsFromDB[] = [
  {
    key: "finance",
    displayName: "Finance",
    description: "Access and manage finance settings.",
    href: null,
    icon: "tax",
    parentNavbarItemKey: "/",
    displayOrder: 1,
    requiredPolicies: ["FinanceService.Billings"],
  },
  {
    key: "finance/billing",
    displayName: "Billing",
    description: "Manage billing settings.",
    href: "finance/billing",
    icon: "log",
    parentNavbarItemKey: "finance",
    displayOrder: 1,
    requiredPolicies: ["FinanceService.Billings"],
  },
];
