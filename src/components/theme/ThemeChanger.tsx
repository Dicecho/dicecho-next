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

const THEMES = ["light", "dark", 'sakura', 'dicecho'];

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
        {THEMES.map((theme) => (
          <SelectItem key={theme} value={theme}>
            {theme}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive.Root>
  );
};
