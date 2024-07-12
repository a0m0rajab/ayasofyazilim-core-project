"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirmation-modal";
import Spinner from "@repo/ayasofyazilim-ui/molecules/spinner";
import { SectionNavbarBase } from "@repo/ayasofyazilim-ui/templates/section-layout";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Form({ initialData, onDeleteClick }: any) {
  const [backerProfiles, setBackerProfiles] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("companies");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmDialogContent, setConfirmDialogContent] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    title: "",
    description: "",
    onConfirm: () => undefined,
  });

  function handleDeleteBacker(backer: any) {
    setConfirmDialogContent({
      title: "Profili Sil",
      description: `"${backer.name}" isimli profili silmek istediğinize emin misiniz?`,
      onConfirm: () => {
        setIsLoading(true);
        onDeleteClick(backer.backerId).then((result: any) => {
          setBackerProfiles(result);
          setIsLoading(false);
        });
        setIsConfirmDialogOpen(false);
      },
    });
    setIsConfirmDialogOpen(true);
  }

  return (
    <Card className="m-auto">
      <SectionNavbarBase
        activeSectionId={activeTab}
        navContainerClassName="shadow-none border"
        onSectionChange={(e) => {
          setActiveTab(e);
        }}
        sections={[
          { id: "companies", name: "Companies" },
          { id: "individuals", name: "Individuals" },
        ]}
        showContentInSamePage
        showScrollArea={false}
      />
      <div className="flex flex-col bg-white">
        {isLoading ? (
          <Spinner
            className="stroke-purple-900"
            containerClassName="border h-20"
            fullScreen={false}
            variant="transparent"
          />
        ) : (
          backerProfiles?.map((i: any) => (
            <div
              className="border flex flex-row px-5 py-3 items-center"
              key={i.backerId}
            >
              <div className="bg-gray-100 rounded-md border p-2">{i.icon}</div>
              <div className="ml-4">
                <div>{i.name}</div>
                <div className="text-sm text-muted-foreground">
                  {i.legalStatusCode}
                </div>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={() => {
                    handleDeleteBacker(i);
                  }}
                  variant="link"
                >
                  <Trash2 className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Link href={`profile/${i.backerId}`}>
                  <Button
                    onClick={() => {
                      setIsLoading(true);
                    }}
                    variant="link"
                  >
                    <Edit className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmDialog
        description={confirmDialogContent.description}
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
        }}
        onConfirm={confirmDialogContent.onConfirm}
        title={confirmDialogContent.title}
      />
    </Card>
  );
}