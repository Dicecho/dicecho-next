import type {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  Metadata,
  NextPage,
} from "next";
import Image from "next/image";
import { RandomAvatar } from "react-random-avatars";
import { api } from "@/utils/api";
import { IModDto } from "@dicecho/types";
import dayjs from "dayjs";
import { RateInfo } from "@/components/Scenario/RateInfo";
import { Album } from "@/components/Album";

import { ComponentProps, FC, PropsWithChildren } from "react";
import clsx from "clsx";
import { useTranslation, Trans } from "next-i18next";
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
    <div className="flex items-center gap-2 " {...props}>
      <div className="font-bold capitalize">{title}</div>
      <div className={clsx("flex-1", className)}>{children}</div>
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
    <>
      <div
        className="w-full h-[280px] bg-cover bg-center bg-no-repeat brightness-75 relative z-0"
        style={{ backgroundImage: `url(${scenario.coverUrl})` }}
      />
      <div className="p-4 mt-[-16px] bg-card relative rounded-t-2xl">
        <div className="text-2xl font-bold mb-2">{scenario.title}</div>
        <div className="text-sm mb-2">
          <span className="opacity-60">[{t("quote_notice")}]</span>
        </div>

        <RateInfo
          className="w-full bg-accent p-4"
          score={scenario.rateAvg}
          count={scenario.rateCount}
          info={scenario.rateInfo}
        />

        <div className="flex flex-col gap-2 mt-2">
          <InfoItem title={t("author")}>
            <div className="flex items-center gap-2">
              {scenario.author.avatarUrl ? (
                <Image
                  className="w-4 h-4 rounded-full"
                  width={16}
                  height={16}
                  src={scenario.author.avatarUrl}
                  alt={scenario.author.nickName}
                />
              ) : (
                <RandomAvatar name={scenario.author.nickName} size={16} />
              )}
              <span className="flex-1">{scenario.author.nickName}</span>
            </div>
          </InfoItem>

          {scenario.isForeign && scenario.contributors.length > 0 && (
            <InfoItem title={t("contributors")}>
              <div className="flex items-center gap-2">
                {scenario.contributors.map((contributor) =>
                  scenario.author.avatarUrl ? (
                    <Image
                      key={contributor._id}
                      className="w-4 h-4 object-cover rounded-full"
                      width={16}
                      height={16}
                      src={contributor.avatarUrl}
                      alt={contributor.nickName}
                    />
                  ) : (
                    <RandomAvatar
                      key={contributor._id}
                      name={contributor.nickName}
                      size={16}
                    />
                  )
                )}
              </div>
            </InfoItem>
          )}

          {scenario.tags.length > 0 && (
            <InfoItem title={t("tags")} className="opacity-60">
              <div className="flex items-center gap-2">
                {scenario.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </InfoItem>
          )}

          <InfoItem title={t("rule")} className="opacity-60">
            {scenario.moduleRule}
          </InfoItem>

          <div className="text-sm opacity-60">
            <Trans
              i18nKey="publish_at"
              t={t}
              values={{
                date: dayjs(scenario.releaseDate).format("YYYY/MM/DD"),
              }}
            />
          </div>
        </div>
      </div>

      {scenario.imageUrls.length > 0 && (
        <div className="p-4 relative w-full bg-card mt-4">
          <Album imageUrls={scenario.imageUrls} />
        </div>
      )}

      {scenario.description && (
        <div className="p-4 relative w-full bg-card mt-4">
          <article className="break-words whitespace-pre-line line-clamp-4">
            {scenario.description}
          </article>
        </div>
      )}
    </>
  );
};

export default ScenarioDetailPage;
