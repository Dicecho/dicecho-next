import type {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  Metadata,
  NextPage,
} from "next";
// import initTranslations from '@/app/i18n';
import { api } from "@/utils/api";
import { IModDto } from "@dicecho/types";

import { RateInfo } from "@/components/Scenario/RateInfo";
import { ComponentProps, FC, PropsWithChildren } from "react";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const scenario = await api.module.detail(params.id);

  return {
    title: scenario.title,
    description: scenario.description,
    metadataBase: new URL("https://www.dicecho.com"),
    keywords: [
      "dicecho",
      "骰声回响",
      "scenario",
      "模组",
      scenario.moduleRule,
      ...scenario.tags,
    ],
    applicationName: "dicecho",
    authors: [{ name: scenario.author.nickName }],
    assets: scenario.modFiles.map((file) => file.url),
    openGraph: {
      title: scenario.title,
      description: scenario.description,
      authors: [scenario.author.nickName],
      siteName: "dicecho.com",
      images: [scenario.coverUrl, ...scenario.imageUrls],
    },
  };
}

const InfoItem: FC<
  PropsWithChildren<ComponentProps<"div"> & { title: string }>
> = ({ title, className, children, ...props }) => {
  return (
    <div className={clsx("flex", className)} {...props}>
      <div>{title}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

interface PageProps {
  scenario: IModDto;
}

export const getServerSideProps: GetServerSideProps<
  PageProps,
  { id: string }
> = async ({ params, locale }) => {
  const scenario = await api.module.detail(params!.id);
  const props: PageProps = {
    ...(await serverSideTranslations(locale ?? "en", ["common", "scenario"])),
    scenario,
  };

  return { props };
};

const ScenarioDetailPage: NextPage<PageProps> = ({ scenario }) => {
  const { t } = useTranslation(["scenario"]);

  return (
    <div>
      <div
        className="w-full h-[280px] bg-cover bg-center bg-no-repeat brightness-75"
        style={{ backgroundImage: `url(${scenario.coverUrl})` }}
      />
      <div className="card p-4 mt-[-16px] bg-base-100">
        <div className="text-2xl font-bold mb-2">{scenario.title}</div>
        <div className="text-sm mb-2">
          <span className="opacity-60">[{t("quote_notice")}]</span>
        </div>

        <RateInfo
          className="w-full bg-base-200 p-4"
          score={scenario.rateAvg}
          count={scenario.rateCount}
          info={scenario.rateInfo}
        />

        <InfoItem title={t("author")}>
          <div className="avatar">
            <img
              className="w-4 h-4"
              src={scenario.author.avatarUrl}
              alt={scenario.author.nickName}
            />
          </div>
          {scenario.author.nickName}
        </InfoItem>
      </div>
    </div>
  );
};

export default ScenarioDetailPage;
