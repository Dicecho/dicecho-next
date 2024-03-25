import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { api } from "@/utils/api";
import { ModListApiResponse } from "@dicecho/types";
import { Suspense, useState } from "react";
import Link from "next/link";
import { RefreshCw, Upload, Plus } from "lucide-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ScenarioList } from "@/components/Scenario/ScenarioList";
import { useTranslation } from "next-i18next";
import { ScenarioFilter } from "@/components/Scenario/ScenarioFilter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const getServerSideProps: GetServerSideProps<{}> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "scenario"])),
  },
});

export default function Scenario() {
  const [t] = useTranslation(["common", "scenario"]);

  return (
    <div className="container mx-auto pt-4">
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-6 md:col-span-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder={t("scenario_search_placeholder", { ns: "scenario" })}
            />
            <Button className="capitalize">{t("search")}</Button>
          </div>

          <div className="divider" />

          <ScenarioList query={{ sort: { lastRateAt: -1 } }} />
        </div>
        <div className="hidden md:flex md:col-span-2 gap-4 flex-col">
          <Button className="capitalize">
            <Upload size={16} />
            {t("scenario_publish")}
          </Button>
          <Button className="capitalize">
            <Plus size={16} />
            {t("commit_scenario_page")}
          </Button>

          <Card className="sticky top-20">
            <CardHeader className="flex flex-row items-center capitalize">
              <span>{t("filter")}</span>
              <Button className="ml-auto capitalize" variant="ghost" size="sm">
                <RefreshCw size={14} />
                {t("refresh")}
              </Button>
            </CardHeader>

            <CardContent>
              <ScenarioFilter />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
