import type { Metadata } from "next";
import { api } from "@/utils/api";
import { RateInfo } from "@/components/Scenario/RateInfo";
import { ComponentProps, FC, PropsWithChildren } from "react";
import clsx from "clsx";

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

export default async function ScenarioDetail({
  params,
}: {
  params: { id: string };
}) {
  const scenario = await api.module.detail(params.id);

  return (
    <div>
      <div
        className="w-full h-[280px] bg-cover bg-center bg-no-repeat brightness-75"
        style={{ backgroundImage: `url(${scenario.coverUrl})` }}
      />
      <div className="card p-4 mt-[-16px] bg-base-100">
        <div className="text-2xl font-bold mb-2">{scenario.title}</div>
        <div className="text-sm mb-2">
          <span className="opacity-60">
            [此条目并非转载，引用的标题封面等基本信息仅用于交流、介绍和评论]——
          </span>
          <a className="text-primary">词条功能使用及规则</a>
        </div>

        <RateInfo
          className="w-full bg-base-200 p-4"
          score={scenario.rateAvg}
          count={scenario.rateCount}
          info={scenario.rateInfo}
        />

        <InfoItem title="原作者">
          <div
            className="avatar"
          >
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
}
