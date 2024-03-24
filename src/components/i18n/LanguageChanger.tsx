import { Globe } from "lucide-react";
import { useRouter } from "next/router";
import { SelectContent, SelectItem } from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";

const LanguageKey = {
  en: "en",
  zh: "zh",
  jp: "jp",
} as const;

const LanguageLabel = {
  [LanguageKey.en]: "English",
  [LanguageKey.zh]: "简体中文",
  [LanguageKey.jp]: "日本語",
};

export const LanguageChanger = () => {
  const { pathname, query, asPath, push } = useRouter();

  const changeLanguage = (locale: string) => {
    push({ pathname, query }, asPath, { locale });
  };

  return (
    <SelectPrimitive.Root onValueChange={(value) => changeLanguage(value)}>
      <SelectPrimitive.Trigger asChild>
        <Globe className="cursor-pointer" />
      </SelectPrimitive.Trigger>

      <SelectContent position="popper" side="bottom" align="end">
        {Object.keys(LanguageKey).map((lng) => (
          <SelectItem key={lng} value={lng}>
            {LanguageLabel[lng as keyof typeof LanguageKey]}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive.Root>
  );
};
