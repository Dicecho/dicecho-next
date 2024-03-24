"use client";
import clsx from "clsx";
import { ComponentProps, FC, useState } from "react";
import { useTranslation } from "next-i18next";
import { BookOpenText, MessageCircleMore, Videotape } from "lucide-react";
import Link from "next/link";
import Img from "next/image";
import logo from "./logo.png";
import { ThemeChanger } from "@/components/theme/ThemeChanger";
import { LanguageChanger } from "@/components/i18n/LanguageChanger";

export type HeaderProps = ComponentProps<"div">;
export const Header: FC<HeaderProps> = (props) => {
  const [t] = useTranslation(["common"]);
  return (
    <div
      {...props}
      className={clsx("sticky top-0 left-0 right-0 z-10 shadow-xl")}
    >
      <div className="container mx-auto">
        <div className={clsx("navbar")}>
          <div className="navbar-start">
            <Link href="/" passHref>
              <Img src={logo.src} alt="diceho logo" width={32} height={32} />
            </Link>
          </div>

          <div className="navbar-center hidden md:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link href="/scenario" passHref>
                  <BookOpenText size={16} />
                  {t("scenario")}
                </Link>
              </li>
              <li>
                <Link href="/forum" passHref>
                  <MessageCircleMore size={16} />
                  {t("forum")}
                </Link>
              </li>
              <li>
                <Link href="/replay" passHref>
                  <Videotape size={16} />
                  {t("replay")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 
        <div className="navbar-center">
        </div> */}
          <div className="navbar-end gap-4">
            <LanguageChanger />
            <ThemeChanger />
            <div className="btn btn-sm">Sign in</div>
          </div>
        </div>
      </div>
      {/* <AccountModal
        open={accountModalOpen}
        dismiss={() => setAccountModalOpen(false)}
      /> */}
    </div>
  );
};
