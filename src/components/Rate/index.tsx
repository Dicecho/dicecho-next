import clsx from "clsx";
import { ComponentProps, FC, useId } from "react";

interface RateProps extends Omit<ComponentProps<"div">, "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  allowHalf?: boolean;
  readOnly?: boolean;
  color?: string;
  size?: "lg" | "md" | "sm" | "xs";
  allowClear?: boolean;
}

export const Rate: FC<RateProps> = ({
  value = 0,
  onChange,
  allowHalf = false,
  readOnly = onChange === undefined,
  color = "orange-400",
  size = "md",
  allowClear = value === 0,
  className,
  ...props
}) => {
  const name = useId();
  const itemCount = allowHalf ? 10 : 5;
  const score = Math.floor(Math.min(Math.max(value, 0), itemCount));

  return (
    <div
      className={clsx(className, "rating", `rating-${size}`, {
        "rating-half": allowHalf,
      })}
      {...props}
    >
      {allowClear && (
        <input readOnly type="radio" name={name} className="rating-hidden hidden" checked={score === 0} />
      )}
      {new Array(itemCount).fill('').map((_, index) => (
        <input
          key={index}
          readOnly={readOnly}
          checked={score === index + 1}
          type="radio"
          name={name}
          className={clsx(
            "mask mask-star",
            `bg-${color}`,
            { "mask-half-1": index % 2 === 0 && allowHalf },
            { "mask-half-2": index % 2 === 1 && allowHalf },
          )}
        />
      ))}
    </div>
  );
};
