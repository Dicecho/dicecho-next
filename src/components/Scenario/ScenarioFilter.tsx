"use client";
import React from "react";
import Img from "next/image";
import { IModListQuery, ModSortKey, SortOrder } from "@dicecho/types";
import { api } from "@/utils/api";
import { Rate } from "@/components/Rate";
import clsx from "clsx";
import useSWR from "swr";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'next-i18next';
import { Input } from "@/components/ui/input";
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

interface ScenarioFilterProps {
  initialQuery?: Partial<IModListQuery>;
}

const SortKeys = [
  ModSortKey.RELEASE_DATE,
  ModSortKey.RATE_COUNT,
  ModSortKey.RATE_AVG,
  ModSortKey.LAST_RATE_AT,
  ModSortKey.LAST_EDIT_AT,
  ModSortKey.CREATED_AT,
  ModSortKey.UPDATED_AT,
] as const;

const formSchema = z.object({
  rule: z.string().optional(),
  language: z.string().optional(),
  sortKey: z.enum(SortKeys).optional(),
  sortOrder: z.nativeEnum(SortOrder).optional(),
});

type FormData = {
  rule: string;
  language: string;
  sortKey: string;
  soryOrder: number;
};

export function ScenarioFilter({ initialQuery }: ScenarioFilterProps) {
  const [t] = useTranslation(['scenario'])
  const { data: config } = useSWR(["scenario", "config"], api.module.config);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sortKey: ModSortKey.LAST_RATE_AT,
      sortOrder: SortOrder.DESC,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="rule"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_rule')} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_languages')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {config?.languages.map((language) => (
                    <SelectItem key={language._id} value={language._id}>
                      {language._id}({language.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
