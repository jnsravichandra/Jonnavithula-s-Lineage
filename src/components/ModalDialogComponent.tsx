import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
export const ModalDialog = ({ open, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 flex justify-center items-center z-50 transition-colors
        ${open ? "visible bg-background-primary/50" : "invisible"}`}
      >
        {/* modal container */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-background-secondary rounded-xl shadow p-6 transition-all relative w-1/2 ${
            open ? "scale-100 opacity-100" : "scale-125 opacity-0"
          }`}
        >
          <button onClick={onClose} className="absolute top-2 right-2 p-1">
            <XMarkIcon className="h-7 w-7" />
          </button>
          {/* modal header */}
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-lg">
              {title}
            </h1>
          </div>
          {/* modal body */}
          <div>{children}</div>
          {/* modal footer */}
          <div>
            
          </div>
        </div>
      </div>
    </>
  );
};
