"use client";
import { MenuProps } from "@repo/ayasofyazilim-ui/molecules/side-bar";
import Mainlayout from "@repo/ayasofyazilim-ui/templates/mainlayout";
import LanguageSelector from "components/language-selector";
import { Presentation, SquareStack, User } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { useConfig } from "src/providers/configuration";
import { useLocale } from "src/providers/locale";
import { useUser } from "src/providers/user";
import { getBaseLink } from "src/utils";
import "../../globals.css";
import Header from "../../../components/header";
import Navbar from "components/navbar";

type LayoutProps = {
  children: JSX.Element;
};

export default function Layout({ children }: LayoutProps) {
  const { user, getUser } = useUser();
  const { config, setConfig } = useConfig();
  const { cultureName, resources } = useLocale();
  const [resourcesMap, setResourcesMap] = useState<{ [key: string]: string }>({
    profile: "Profile",
    dashboard: "Dashboard",
  });

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    setResourcesMap({
      profile: resources?.AbpUi?.texts?.PersonalInfo || "Profile",
      dashboard:
        resources?.AbpForDeploy?.texts?.["Menu:Dashboard"] || "Dashboard",
    });
  }, [cultureName]);

  const router = useRouter();
  const navigationLinks = [
    {
      href: "/profile",
      text: resourcesMap.profile,
    },
    {
      href: "/dashboard",
      text: resourcesMap.dashboard,
    },
    {
      title: "Pages",
      submenu: [
        {
          title: resourcesMap.dashboard,
          href: "/dashboard",
          description: "Show the user dashboard.",
        },
        {
          title: resourcesMap.profile,
          href: "/profile",
          description: "Show the user profile",
        },
      ],
    },
  ];
  const exampleMenus: MenuProps[] = [
    {
      label: "Pages",
      name: resourcesMap.profile,
      icon: <User size={15} className="mr-2" />,
      href: getBaseLink("profile", cultureName),
    },
    {
      label: "Pages",
      name: resourcesMap.dashboard,
      icon: <SquareStack size={15} className="mr-2" />,
      href: getBaseLink("dashboard", cultureName),
    },
    {
      label: "Pages",
      name: "Projects",
      icon: <Presentation size={15} className="mr-2" />,
      href: getBaseLink("projects", cultureName),
    },
    {
      label: "Settings",
      name: "Settings",
      icon: <Presentation size={15} className="mr-2" />,
      href: getBaseLink("settings/profile", cultureName),
    },
  ];
  const userNavigation = {
    username: user?.name,
    initials: user?.name?.substring(0, 2).toUpperCase(),
    email: user?.email,
    imageURL: "https://github.com/shadcn.png",
    menuLinks: [
      {
        href: "profile",
        text: resourcesMap.profile,
        shortcut: "⌘P",
      },
      {
        href: "dashboard",
        text: resourcesMap.dashboard,
        shortcut: "⌘D",
      },
    ],
    logoutFunction: async () => {
      let result = await fetch("/api/auth/logout");
      if (result.ok === false) {
        console.error("Failed to logout");
        return;
      }
      router.push("/");
    },
  };
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-col z-90 border-b border-gray-100">
        <Header />
        <Navbar />
      </div>
      <div className="container overflow-hidden flex">{children}</div>
      {/* h-full removed */}
    </div>
  );
}