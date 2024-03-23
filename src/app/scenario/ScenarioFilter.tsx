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

const onSubmit = (data: FormData) => console.log(data);
export function ScenarioFilter({ initialQuery }: ScenarioFilterProps) {
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
                    <SelectValue placeholder="Select rule" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={undefined as any as string}>
                    Seleact a rule
                  </SelectItem>
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
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={undefined as any as string}>
                    Seleact language
                  </SelectItem>
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

        <div>

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={undefined as any as string}>
                      Seleact language
                    </SelectItem>
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

        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );

  return (
    <form className="flex flex-col gap-4">
      {/* <MyCombobox /> */}

      {/* <Select 
        className="w-full"
        placeholder="Please select"
        mode="multiple"
        allowClear
        options={config?.rules.map((rule) => ({ label: rule._id, value: `${rule._id}(${rule.count})` }))}
        {...register('rule')}
      /> */}

      {/* <select className="select select-bordered w-full" {...register("rule")}>
        <option value={""} selected>
          Select Rule
        </option>
        {config?.rules.map((rule) => (
          <option key={rule._id} value={rule._id}>
            {rule._id}({rule.count})
          </option>
        ))}
      </select> */}

      <select className="select select-bordered w-full">
        <option disabled selected>
          Select Language
        </option>
        {config?.languages.map((language) => (
          <option key={language._id} value={language._id}>
            {language._id}({language.count})
          </option>
        ))}
      </select>

      {/* <div className="join w-full">
        <select className="select select-bordered join-item">
          {SortKeys.map((sortKey) => (
            <option key={sortKey} value={sortKey}>{sortKey}</option>
          ))}
        </select>
        <button className="btn join-item">
          hhh
        </button>
      </div> */}
    </form>
  );
}
