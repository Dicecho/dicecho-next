import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { api } from "@/utils/api";
import { ModListApiResponse } from "@dicecho/types";
import { Suspense } from "react";
import Link from "next/link";
import { ScenarioCard } from './ScenarioCard';

export default async function Scenario() {
  const { data: scenarios, page, pageSize, hasNext } = await api.module.list();

  return (
    <div className="container mx-auto pt-4">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6 md:col-span-4">

          <div className="join w-full mb-4">
            <input className="input input-bordered w-full join-item" placeholder="输入模组名称/介绍/原作者来搜索"/>
            <button className="btn btn-primary px-10 join-item">搜索</button>
          </div>
    
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-16">
            <Suspense fallback={<div>Loading...</div>}>
              {scenarios.map((scenario) => (
                <Link href={`/scenario/${scenario._id}`} passHref key={scenario._id}>
                  <ScenarioCard scenario={scenario}/>
                </Link>
              ))}
            </Suspense>
          </div>
        </div>
        <div className="hidden md:flex md:col-span-2 gap-4 flex-col">
          <button className="btn btn-primary btn-block">模组投稿</button>
          <button className="btn btn-primary btn-block">添加讨论词条</button>

          <div className="card bg-base-200 sticky top-20">
            <div className="card-body">
              筛选
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
