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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export type HeaderProps = ComponentProps<"div">;
export const Header: FC<HeaderProps> = (props) => {
  const [t] = useTranslation(["common"]);
  return (
    <div
      {...props}
      className={clsx("sticky top-0 left-0 right-0 z-10 shadow-xl bg-card")}
    >
      <div className="container mx-auto">
        <div className="flex items-center min-h-16">
          <div className="w-1/2 justify-start">
            <Link href="/" passHref>
              <Img src={logo.src} alt="diceho logo" width={32} height={32} />
            </Link>
          </div>

          <div className="shrink-0 hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/scenario" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={clsx(navigationMenuTriggerStyle(), 'capitalize')}
                    >
                      <BookOpenText size={16} />
                      {t("scenario")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/forum" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={clsx(navigationMenuTriggerStyle(), 'capitalize')}
                    >
                      <MessageCircleMore size={16} />

                      {t("forum")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/replay" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={clsx(navigationMenuTriggerStyle(), 'capitalize')}
                    >
                      <Videotape size={16} />

                      {t("replay")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 
        <div className="navbar-center">
        </div> */}
          <div className="w-1/2 justify-end flex gap-4 capitalize items-center">
            <LanguageChanger />
            <ThemeChanger />
            <Button size="sm">{t("sign_in")}</Button>
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
