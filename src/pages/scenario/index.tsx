import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { api } from "@/utils/api";
import { IModListQuery, ModSortKey } from "@dicecho/types";
import { Suspense, useState } from "react";
import Link from "next/link";
import { RefreshCw, Upload, Plus } from "lucide-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ScenarioList } from "@/components/Scenario/ScenarioList";
import { useTranslation } from "next-i18next";
import {
  ScenarioFilter,
  FormData as ScenarioFilterData,
} from "@/components/Scenario/ScenarioFilter";
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
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps<{}> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "scenario"])),
  },
});

const DEFAULT_QUERY: Partial<IModListQuery> = {
  sort: { lastRateAt: -1 },
};

function queryToFilter(query: Partial<IModListQuery>): ScenarioFilterData {
  return {
    rule: query.filter?.moduleRule,
    language: query.languages?.[0],
    sortKey: Object.keys(query.sort ?? { lastRateAt: -1 })[0] as ModSortKey,
    sortOrder: Object.values(query.sort ?? { lastRateAt: -1 })[0],
  };
}

function filterToQuery(data: ScenarioFilterData): Partial<IModListQuery> {
  const query: Partial<IModListQuery> = {};
  if (data.rule) {
    Object.assign(query, {
      filter: {
        moduleRule: data.rule,
      },
    });
  }

  if (data.language) {
    Object.assign(query, {
      languages: [data.language],
    });
  }

  if (data.sortKey && data.sortOrder) {
    Object.assign(query, {
      sort: {
        [data.sortKey]: data.sortOrder,
      },
    });
  }

  return query;
}

export default function Scenario() {
  const [t] = useTranslation(["common", "scenario"]);
  const { push } = useRouter();
  const [query, setQuery] = useState<Partial<IModListQuery>>(DEFAULT_QUERY);
  const [searchText, setSearchText] = useState("");

  const handleQueryChange = (query: Partial<IModListQuery>) => {
    // todo: save setting to localstorage
    // todo: add query to url
    setQuery(query);
  };

  const handleSearch = () => {
    handleQueryChange({
      ...query,
      keyword: searchText,
    });
  };

  const handleRandom = () => {
    api.module.random().then((res) => {
      push(`/scenario/${res._id}`);
    });
  };

  return (
    <div className="container mx-auto pt-4">
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-6 md:col-span-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder={t("scenario_search_placeholder", { ns: "scenario" })}
              value={searchText}
              onChange={(e) => setSearchText(e.currentTarget.value)}
              onEnter={handleSearch}
            />
            <Button className="capitalize" onClick={handleSearch}>
              {t("search")}
            </Button>
          </div>

          <div className="divider" />

          <ScenarioList query={query} />
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
            <CardHeader>
              <CardTitle className="capitalize">{t("filter")}</CardTitle>
            </CardHeader>

            <CardContent>
              <ScenarioFilter
                initialFilter={queryToFilter(query)}
                onChange={(data) => handleQueryChange(filterToQuery(data))}
              />
              <Button className="w-full mt-4 capitalize" onClick={() => handleRandom()}>
                {t('random_scenario')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
