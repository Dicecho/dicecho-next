import type { Metadata } from "next";
import { api } from "@/utils/api";

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
    keywords: [
      "dicecho",
      "骰声回响",
      "scenario",
      "模组",
      scenario.moduleRule,
      ...scenario.tags,
    ],
    applicationName: 'dicecho',
    authors: [{ name: scenario.author.nickName }],
    assets: scenario.modFiles.map((file) => file.url),
    openGraph: {
      title: scenario.title,
      description: scenario.description,
      authors: [scenario.author.nickName],
      siteName: 'dicecho.com',
      images: [scenario.coverUrl, ...scenario.imageUrls],
    },
  };
}

export default async function ScenarioDetail({
  params,
}: {
  params: { id: string };
}) {
  const mod = await api.module.detail(params.id);

  return (
    <div>
      {mod.title}

      <div className="rating rating-sm disabled">
        <input
          disabled
          type="radio"
          name="rating"
          className="disabled mask mask-star-2 bg-orange-400"
        />
        <input
          disabled
          type="radio"
          name="rating"
          className="disabled mask mask-star-2 bg-orange-400"
          checked
        />
        <input
          disabled
          type="radio"
          name="rating"
          className="disabled mask mask-star-2 bg-orange-400"
        />
        <input
          disabled
          type="radio"
          name="rating"
          className="disabled mask mask-star-2 bg-orange-400"
        />
        <input
          disabled
          type="radio"
          name="rating"
          className="disabled mask mask-star-2 bg-orange-400"
        />
      </div>
    </div>
  );
}
