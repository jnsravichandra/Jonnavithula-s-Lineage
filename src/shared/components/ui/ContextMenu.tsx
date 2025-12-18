import React, { useEffect, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  options: { label: string; action: () => void }[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  options,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-background-secondary border rounded-md shadow-lg"
      style={{ top: y, left: x }}
    >
      {options.map((option) => (
        <div key={option.label} onClick={option.action} className="px-4 py-2 hover:bg-background-primary cursor-pointer">
          {option.label}
        </div>
      ))}
    </div>
  );
};
