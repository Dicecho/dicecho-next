"use client";
import { IModDto, IModListQuery } from "@dicecho/types";
import useSWRInfinite from "swr/infinite";
import { ComponentProps, FC, useEffect } from "react";
import Link from "next/link";
import { api } from "@/utils/api";
import { ScenarioCard } from "./ScenarioCard";
import { useInView } from "react-intersection-observer";

import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { omit } from "lodash";

interface ScenarioListProps extends ComponentProps<"div"> {
  query?: Partial<IModListQuery>;
  renderHeader?: (state: {
    isLoading: boolean;
    total: number;
  }) => React.ReactNode;
}

export const ScenarioList: FC<ScenarioListProps> = ({
  query = {},
  className,
  renderHeader,
  ...props
}) => {
  const [t] = useTranslation(["common"]);
  const { ref, inView } = useInView();

  const { data, isLoading, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData) return null; // reached the end
      return [`scenarios`, pageIndex + 1, omit(query, "page")];
    },
    ([_, page, query]) => api.module.list({ ...query, page }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
    }
  );

  const lastPage = data?.[data.length - 1];

  useEffect(() => {
    if (isLoading) return;
    if (inView && lastPage?.hasNext) {
      setSize((preSize) => preSize + 1);
    }
  }, [inView, isLoading, setSize, lastPage]);

  return (
    <>
      {renderHeader &&
        renderHeader({ total: data?.[0].totalCount ?? 0, isLoading })}
      <div
        className={clsx("grid grid-cols-2 md:grid-cols-4 gap-8", className)}
        {...props}
      >
        {data?.map((page) =>
          page.data.map((scenario) => (
            <Link
              href={`/scenario/${scenario._id}`}
              // passHref
              key={scenario._id}
            >
              <ScenarioCard scenario={scenario} />
            </Link>
          ))
        )}
      </div>

      <div className="capitalize" ref={ref}>
        {t("load_more")}
      </div>
    </>
  );
};
