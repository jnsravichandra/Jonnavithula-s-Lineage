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
          className={`bg-background-secondary rounded-xl shadow-xl p-lg transition-all relative w-4/6 border flex flex-col max-h-[120vh] ${
            open ? "scale-70 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <button onClick={onClose} className="absolute top-2 right-2 p-lg">
            <XMarkIcon className="h-10 w-10" />
          </button>
          {/* modal header */}
          <div className="shrink-0">
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-lg">
              {title}
            </h1>
          </div>
          {/* modal body */}
          <div className="overflow-y-auto px-lg">{children}</div>
          {/* modal footer */}
          <div className="shrink-0">
            
          </div>
        </div>
      </div>
    </>
  );
};
