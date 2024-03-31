import type { GetServerSideProps, Metadata, NextPage } from "next";
import Image from "next/image";
import { RandomAvatar } from "react-random-avatars";
import { api } from "@/utils/api";
import { IModDto } from "@dicecho/types";
import dayjs from "dayjs";
import { RateInfo } from "@/components/Scenario/RateInfo";
import { Album } from "@/components/Album";
import { StarIcon, HeartIcon, BookmarkPlusIcon, LinkIcon } from "lucide-react";
import { ComponentProps, FC, PropsWithChildren } from "react";
import clsx from "clsx";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LanguageCodes, LanguageCodeMap } from "@/utils/language";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const { t, i18n } = useTranslation(["scenario"]);

  const infos = (
    <>
      <InfoItem className="flex items-center" title={t("author")}>
        <span className="inline-block mr-2">
          {scenario.author.avatarUrl ? (
            <Image
              className="w-5 h-5 rounded-full"
              width={20}
              height={20}
              src={scenario.author.avatarUrl}
              alt={scenario.author.nickName}
            />
          ) : (
            <RandomAvatar name={scenario.author.nickName} size={20} />
          )}
        </span>
        <span className="flex-1 opacity-60">{scenario.author.nickName}</span>
      </InfoItem>

      {scenario.isForeign && scenario.contributors.length > 0 && (
        <InfoItem title={t("contributors")}>
          <div className="flex items-center gap-2">
            {scenario.contributors.map((contributor) =>
              scenario.author.avatarUrl ? (
                <Image
                  key={contributor._id}
                  className="w-5 h-5 object-cover rounded-full"
                  width={20}
                  height={20}
                  src={contributor.avatarUrl}
                  alt={contributor.nickName}
                />
              ) : (
                <RandomAvatar
                  key={contributor._id}
                  name={contributor.nickName}
                  size={20}
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

      {scenario.languages.length > 0 && (
        <InfoItem title={t("languages")} className="opacity-60">
          <div className="flex items-center gap-2">
            {scenario.languages.map((language) => (
              <span key={language}>
                {LanguageCodeMap[i18n.language][language as LanguageCodes]}
              </span>
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
    </>
  );

  const actions = (
    <>
      <Button variant='outline' color='primary'>
        <StarIcon size={16} />
        {t("rate")}
      </Button>
      <Button variant='outline' color='primary'>
        <HeartIcon size={16} />
        {t("mark")}
      </Button>
      <Button variant='outline' color='primary'>
        <BookmarkPlusIcon size={16} />
        {t("collect")}
      </Button>
      <Button className="ml-auto" color='primary'>
        <LinkIcon size={16} />
        {t("origin")}
      </Button>
    </>
  );

  return (
    <div className="md:container">
      <div
        className="w-full h-[280px] bg-cover bg-center bg-no-repeat brightness-75 relative z-0 md:hidden"
        style={{ backgroundImage: `url(${scenario.coverUrl})` }}
      />
      <Card className="p-4 mt-[-16px] relative rounded-t-2xl md:mt-10 md:rounded md:flex">
        <div
          className="hidden md:block w-32 aspect-[3/4] bg-cover bg-center shadow-2xl -mt-[40px] mr-[24px]"
          style={{ backgroundImage: `url(${scenario.coverUrl})` }}
        />

        <div className="flex flex-col flex-1">
          <div className="text-2xl font-bold mb-2">{scenario.title}</div>
          <div className="text-sm mb-2">
            <span className="opacity-60">[{t("quote_notice")}]</span>
          </div>

          <div className="hidden md:flex w-full mt-auto gap-2">{actions}</div>
        </div>

        <RateInfo
          className="w-full bg-accent p-4 md:hidden"
          score={scenario.rateAvg}
          count={scenario.rateCount}
          info={scenario.rateInfo}
        />

        <div className="flex flex-col gap-2 mt-2 md:hidden">{infos}</div>

        <div className="hidden md:flex pl-4 ml-4 border-l-[1px] border-solid min-w-40 flex-col gap-2">
          <div className="opacity-45 capitalize">{t("dicecho_rating")}</div>
          {scenario.rateAvg > 0 ? (
            <div>
              <span className="text-primary text-4xl font-bold">
                {scenario.rateAvg}
              </span>
              <span className="opacity-45"> / 10</span>
            </div>
          ) : (
            <div className="opacity-60">
              {scenario.rateCount === 0 ? t("no_rating") : t("too_few_ratings")}
            </div>
          )}
          {scenario.rateCount > 0 && (
            <div className="opacity-60">
              <Trans
                i18nKey="ratings"
                t={t}
                values={{
                  count: scenario.rateCount,
                }}
              />
            </div>
          )}
          {scenario.markCount > 0 && (
            <div className="opacity-60">
              <Trans
                i18nKey="marks"
                t={t}
                values={{
                  count: scenario.markCount,
                }}
              />
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6 md:col-span-4">
          {scenario.imageUrls.length > 0 && (
            <Card className="p-4 relative w-full mt-4">
              <Album imageUrls={scenario.imageUrls} />
            </Card>
          )}

          {scenario.description && (
            <Card className="p-4 relative w-full mt-4">
              <article className="break-words whitespace-pre-line line-clamp-4 opacity-65">
                {scenario.description}
              </article>
            </Card>
          )}
        </div>
        <div className="hidden md:flex md:col-span-2 gap-4 flex-col">
          <Card className="p-4 relative w-full mt-4 flex flex-col gap-4">
            {infos}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScenarioDetailPage;
