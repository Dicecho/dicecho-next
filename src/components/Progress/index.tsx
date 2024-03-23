import clsx from "clsx";
import { ComponentProps, FC } from "react";

interface ProgressProps extends ComponentProps<"div"> {
  value: number;
  color?: string;
}

export const Progress: FC<ProgressProps> = ({
  value,
  color = 'bg-primary',
  className,
  ...props
}) => {
  const progressValue = Math.min(Math.max(0, value), 100);

  return (
    <div
      className={clsx("w-full bg-base-content bg-opacity-20 rounded-full h-2", className)}
      {...props}
    >
      <div
        className={clsx("h-2 rounded-full", color)}
        style={{ width: `${progressValue}%` }}
      />
    </div>
  );
};
