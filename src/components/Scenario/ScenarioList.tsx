"use client";
import { IModDto, IModListQuery } from "@dicecho/types";
import useSWRInfinite from "swr/infinite";
import {
  ComponentProps,
  FC,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { api } from "@/utils/api";
import { ScenarioCard } from "./ScenarioCard";
import { useInView, IntersectionOptions } from "react-intersection-observer";

import clsx from "clsx";
import qs from "qs";
import { useTranslation } from "next-i18next";

interface ScenarioListProps extends ComponentProps<"div"> {
  query?: Partial<IModListQuery>;
  // scenarios: IModDto[]
}

export const ScenarioList: FC<ScenarioListProps> = ({
  // scenarios: initialScenarios,
  query = {},
  className,
  ...props
}) => {
  const [t] = useTranslation(["common"]);
  const { ref, inView } = useInView();

  const { data, isLoading, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData) return null; // reached the end
      return [`scenarios`, pageIndex + 1, query];
    },
    ([_, page, query]) => api.module.list({ ...query, page })
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
      <div
        className={clsx("grid grid-cols-2 md:grid-cols-4 gap-8", className)}
        {...props}
      >
        {data?.map((page) =>
          page.data.map((scenario) => (
            <Link
              href={`/scenario/${scenario._id}`}
              passHref
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
