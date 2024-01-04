import clsx from "clsx";
import { PropsWithChildren } from "react";
import { useKeyboardEvent } from "@react-hookz/web";

export type ModalProps = PropsWithChildren<{
  open: boolean;
  dismiss: () => void;
  disableClickOutside?: boolean;
}>;

export const Modal: React.FC<ModalProps> = ({
  children,
  open,
  dismiss,
  disableClickOutside = false,
}) => {
  useKeyboardEvent(
    (e) => e.key === "Escape",
    () => {
      if (!disableClickOutside) {
        dismiss();
      }
    }
  );

  return (
    <div
      className={clsx("modal modal-bottom sm:modal-middle", {
        "modal-open": open,
      })}
    >
      {children}
      {!disableClickOutside && (
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => dismiss()}>close</button>
        </form>
      )}
    </div>
  );
};  
