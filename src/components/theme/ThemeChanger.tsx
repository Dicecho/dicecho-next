import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";

const THEMES = ["light", "dark", "sakura", "dicecho", "cupcake"];

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();

  return (
    <SelectPrimitive.Root onValueChange={(value) => setTheme(value)}>
      <SelectPrimitive.Trigger asChild>
        <div className="cursor-pointer">
          {theme === "light" ? <Sun /> : theme === "dark" ? <Moon /> : <Sun />}
        </div>
      </SelectPrimitive.Trigger>

      <SelectContent position="popper" side="bottom" align="end">
        <div className="flex flex-col gap-2">
          {THEMES.map((theme) => (
            <SelectItem
              data-theme={theme}
              key={theme}
              value={theme}
              className="bg-base-100 text-foreground border-box"
            >
              <div className="flex w-full h-full gap-1 items-center">
                <div className="mr-auto">{theme}</div>
                <div className="w-2 h-4 bg-primary rounded" />
                <div className="w-2 h-4 bg-accent rounded" />
                <div className="w-2 h-4 bg-secondary rounded" />
              </div>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </SelectPrimitive.Root>
  );
};
