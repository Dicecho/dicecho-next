"use client";
import React, { useEffect } from "react";
import { ModSortKey, SortOrder } from "@dicecho/types";
import { LanguageCodes, LanguageCodeMap } from "@/utils/language";
import { api } from "@/utils/api";
import useSWRImmutable from "swr/immutable";
import { ArrowUpNarrowWide, ArrowDownNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SortKeys = [
  ModSortKey.RELEASE_DATE,
  ModSortKey.RATE_COUNT,
  ModSortKey.RATE_AVG,
  ModSortKey.LAST_RATE_AT,
  ModSortKey.LAST_EDIT_AT,
  ModSortKey.CREATED_AT,
  ModSortKey.UPDATED_AT,
] as const;

export const ModSortKeyMap: { [lng: string]: Record<ModSortKey, string> } = {
  zh: {
    [ModSortKey.RATE_AVG]: "评分",
    [ModSortKey.RATE_COUNT]: "评价人数",
    [ModSortKey.RELEASE_DATE]: "发布时间",
    [ModSortKey.LAST_RATE_AT]: "最后评价时间",
    [ModSortKey.LAST_EDIT_AT]: "最后编辑时间",
    [ModSortKey.CREATED_AT]: "创建时间",
    [ModSortKey.UPDATED_AT]: "更新时间",
  },
  en: {
    [ModSortKey.RATE_AVG]: "average rating",
    [ModSortKey.RATE_COUNT]: "rating count",
    [ModSortKey.RELEASE_DATE]: "release date",
    [ModSortKey.LAST_RATE_AT]: "last rate at",
    [ModSortKey.LAST_EDIT_AT]: "last edit at",
    [ModSortKey.CREATED_AT]: "created at",
    [ModSortKey.UPDATED_AT]: "updated at",
  },
  ja: {
    [ModSortKey.RATE_AVG]: "平均評価",
    [ModSortKey.RATE_COUNT]: "評価数",
    [ModSortKey.RELEASE_DATE]: "発売日",
    [ModSortKey.LAST_RATE_AT]: "最終評価時間",
    [ModSortKey.LAST_EDIT_AT]: "最終編集時間",
    [ModSortKey.CREATED_AT]: "作成時間",
    [ModSortKey.UPDATED_AT]: "更新時間",
  },
};

const formSchema = z.object({
  rule: z.string().optional(),
  language: z.string().optional(),
  sortKey: z.enum(SortKeys).optional(),
  sortOrder: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

interface ScenarioFilterProps {
  initialFilter?: Partial<FormData>;
  onChange?: (filter: FormData) => void;
}

export function ScenarioFilter({
  initialFilter = {},
  onChange = () => {},
}: ScenarioFilterProps) {
  const [t, i18n] = useTranslation(["scenario", "common"]);
  const { data: config } = useSWRImmutable(["scenario", "config"], api.module.config);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sortKey: ModSortKey.LAST_RATE_AT,
      sortOrder: SortOrder.DESC.toString(),
      ...initialFilter,
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      onChange(values);
    });

    return () => unsubscribe();
  }, [form, onChange]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="rule"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger allowClear>
                    <SelectValue placeholder={t("select_rule")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {config?.rules.map((rule) => (
                    <SelectItem key={rule._id} value={rule._id}>
                      {rule._id}({rule.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger allowClear>
                    <SelectValue placeholder={t("select_languages")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {config?.languages.map((language) => (
                    <SelectItem key={language._id} value={language._id}>
                      {LanguageCodeMap[i18n.language][language._id as LanguageCodes]}(
                      {language.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="join w-full">
          <FormField
            control={form.control}
            name="sortKey"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="join-item capitalize">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SortKeys.map((key) => (
                    <SelectItem key={key} value={key} className="capitalize">
                      {ModSortKeyMap[i18n.language][key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <Button
                variant="outline"
                className="join-item px-2"
                type="button"
                onClick={() => {
                  field.onChange(
                    field.value === SortOrder.DESC.toString()
                      ? SortOrder.ASC
                      : SortOrder.DESC
                  );
                }}
              >
                {field.value === SortOrder.DESC.toString() ? (
                  <ArrowDownNarrowWide size={16} />
                ) : (
                  <ArrowUpNarrowWide size={16} />
                )}
              </Button>
            )}
          />
        </div>
        <Button
          className="w-full capitalize"
          variant="destructive"
          type="button"
          onClick={() =>
            form.reset({
              rule: "",
              language: "",
              sortKey: ModSortKey.LAST_RATE_AT,
              sortOrder: SortOrder.DESC.toString(),
            })
          }
        >
          {t("reset_filter", { ns: "common" })}
        </Button>
      </form>
    </Form>
  );
}
