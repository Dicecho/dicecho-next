import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { api } from "@/utils/api";
import { ModListApiResponse } from "@dicecho/types";
import { Suspense, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ScenarioList } from "@/components/Scenario/ScenarioList";
import { ScenarioFilter } from "@/components/Scenario/ScenarioFilter";

export const getServerSideProps: GetServerSideProps<{}> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "scenario"])),
  },
});

export default function Scenario() {
  return (
    <div className="container mx-auto pt-4">
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-6 md:col-span-4">
          <div className="join w-full">
            <input
              className="input input-bordered w-full join-item"
              placeholder="Input scenario name / description / author..."
            />
            <button className="btn btn-primary px-10 join-item">Search</button>
          </div>

          <div className="divider" />

          <ScenarioList query={{ sort: { lastRateAt: -1 } }} />
        </div>
        <div className="hidden md:flex md:col-span-2 gap-4 flex-col">
          <button className="btn btn-primary btn-block">
            Scenario Publish
          </button>
          <button className="btn btn-primary btn-block">
            Commit Scenario page
          </button>

          <div className="card sticky top-20">
            <div className="card-body">
              <div className="card-title">
                Filter
                <button className="btn btn-primary btn-outline btn-sm ml-auto">
                  <RefreshCw />
                  Refresh
                </button>
              </div>
              <div className="divider" />
              <ScenarioFilter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
