import { useState, useEffect, useCallback } from 'react';
import type { ContextMenuState, ContextMenuHookState, ContextMenuActions } from '../types';

export function useContextMenu(): { state: ContextMenuHookState; actions: ContextMenuActions } {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const openContextMenu = useCallback((memberId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const anchorEl = event.currentTarget as HTMLElement;
    const rect = anchorEl.getBoundingClientRect();
    setContextMenu({
      memberId,
      anchorEl,
      x: rect.left + rect.width + window.scrollX,
      y: rect.top + window.scrollY,
    });
  }, []);

  // Handle scroll and resize to keep menu positioned correctly
  useEffect(() => {
    if (!contextMenu?.anchorEl) return;

    const updatePosition = () => {
      setContextMenu((prev) => {
        if (!prev?.anchorEl) return null;
        const rect = prev.anchorEl.getBoundingClientRect();
        return {
          ...prev,
          x: rect.left + rect.width + window.scrollX,
          y: rect.top + window.scrollY,
        };
      });
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [contextMenu?.anchorEl]);

  return {
    state: { contextMenu },
    actions: { openContextMenu, closeContextMenu },
  };
}
