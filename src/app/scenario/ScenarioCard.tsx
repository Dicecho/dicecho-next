import React from "react";
import Img from "next/image";
import { IModDto } from "@dicecho/types";
import { Rate } from '@/components/Rate';
import clsx from "clsx";

interface ScenarioCardProps {
  scenario: IModDto;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <div className="card bg-base-100 transition-all shadow-md hover:shadow-xl">
      <div className={clsx("aspect-[3/4] bg-cover bg-center bg-no-repeat")} style={{ backgroundImage: `url(${scenario.coverUrl})` }} />
      <div className="card-body">
        <p className="text-nowrap truncate">{scenario.title}</p>
        <p>{scenario.author.nickName}</p>
        <Rate value={scenario.rateAvg} allowHalf />
      </div>
    </div>
  );
}
