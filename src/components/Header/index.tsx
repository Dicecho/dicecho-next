"use client";
import clsx from "clsx";
import { ComponentProps, FC, useState } from "react";
import Link from "next/link";
import Img from "next/image";
import logo from "./logo.png";
import { ThemeChanger } from "@/components/theme/ThemeChanger";

export type HeaderProps = ComponentProps<"div">;
export const Header: FC<HeaderProps> = (props) => {
  return (
    <div
      {...props}
      className={clsx("sticky top-0 left-0 right-0 z-10 shadow-xl")}
    >
      <div className={clsx("container mx-auto navbar")}>
        <div className="navbar-start">
          <Link href="/" passHref>
            <Img src={logo.src} alt="diceho logo" width={32} height={32} />
          </Link>
        </div>

        <div className="navbar-start hidden md:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/scenario" passHref>
                <span className="icon-[game-icons--rule-book] text-2xl" />
                模组
              </Link>
            </li>
            <li>
              <Link href="/forum" passHref>
                <span className="icon-[game-icons--conversation] text-2xl" />
                讨论区
              </Link>
            </li>
            <li>
              <Link href="/replay" passHref>
                <span className="icon-[game-icons--film-projector] text-2xl" />
                视频
              </Link>
            </li>
          </ul>
        </div>

        {/* 
        <div className="navbar-center">
        </div> */}
        <div className="navbar-end gap-4">
          <ThemeChanger />
          <div className="btn btn-sm">Sign in</div>
        </div>
      </div>
      {/* <AccountModal
        open={accountModalOpen}
        dismiss={() => setAccountModalOpen(false)}
      /> */}
    </div>
  );
};
