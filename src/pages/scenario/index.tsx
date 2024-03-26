import type { GetServerSideProps, NextPage } from "next";
import { api } from "@/utils/api";
import { IModListQuery, ModSortKey } from "@dicecho/types";
import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ScenarioList } from "@/components/Scenario/ScenarioList";
import { useTranslation, Trans } from "next-i18next";
import {
  ScenarioFilter,
  FormData as ScenarioFilterData,
} from "@/components/Scenario/ScenarioFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { omit } from "lodash";
import qs from "qs";

interface PageProps {
  initialQuery: Partial<IModListQuery>;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
  locale,
}) => ({
  props: {
    initialQuery: urlToQuery(qs.stringify(query)),
    ...(await serverSideTranslations(locale ?? "en", ["common", "scenario"])),
  },
});

const DEFAULT_QUERY: Partial<IModListQuery> = {
  sort: { lastRateAt: -1 },
};

function queryToFormData(query: Partial<IModListQuery>): ScenarioFilterData {
  return {
    rule: query.filter?.moduleRule,
    language: query.languages?.[0],
    sortKey: Object.keys(query.sort ?? { lastRateAt: "-1" })[0] as ModSortKey,
    sortOrder: Object.values(query.sort ?? { lastRateAt: "-1" })[0],
  };
}

function formDataToQuery(data: ScenarioFilterData): Partial<IModListQuery> {
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

function urlToQuery(searchQuery: string): Partial<IModListQuery> {
  return {
    ...DEFAULT_QUERY,
    ...qs.parse(searchQuery),
  };
}

function queryToUrl(query: Partial<IModListQuery>): string {
  return qs.stringify(query);
}

const ScenarioPage: NextPage<PageProps> = ({ initialQuery }) => {
  const [t] = useTranslation(["common", "scenario"]);
  const router = useRouter();
  const [query, setQuery] = useState<Partial<IModListQuery>>(initialQuery);
  const [searchText, setSearchText] = useState("");

  const handleQueryChange = (newQuery: Partial<IModListQuery>) => {
    const query = omit(newQuery, "page");
    const newUrlQuery = queryToUrl(query);
    router.replace({ query: newUrlQuery });

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
      router.push(`/scenario/${res._id}`);
    });
  };

  return (
    <div className="container mx-auto pt-4">
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-6 md:col-span-4">
          <div className="join flex w-full items-center">
            <Input
              className="join-item"
              placeholder={t("scenario_search_placeholder", { ns: "scenario" })}
              value={searchText}
              onChange={(e) => setSearchText(e.currentTarget.value)}
              onEnter={handleSearch}
            />
            <Button className="capitalize join-item" onClick={handleSearch}>
              {t("search")}
            </Button>
          </div>
          <ScenarioList
            renderHeader={(state) => (
              <>
                <div className="text-sm opacity-60 mt-2 flex items-center gap-2">
                  <Trans
                    i18nKey="search_result"
                    t={t}
                    values={{
                      count: state.isLoading ? "" : state.total,
                    }}
                    components={{
                      loading: state.isLoading ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <></>
                      ),
                    }}
                  />
                </div>
                <div className="divider !mt-0" />
              </>
            )}
            query={query}
          />
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
                initialFilter={queryToFormData(query)}
                onChange={(data) => handleQueryChange(formDataToQuery(data))}
              />
              <Button
                className="w-full mt-4 capitalize"
                onClick={() => handleRandom()}
              >
                {t("random_scenario")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPage;
