import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import type { TreeNode } from '../../../../shared/datamodels';
import { hierarchy, tree, type HierarchyNode } from 'd3';

interface FamilyTreeCanvasProps {
  rootData: TreeNode;
  onSelect?: (person: TreeNode) => void;
  width?: number;
  height?: number;
}

export default function FamilyTreeCanvas({ rootData, onSelect, width: initialWidth, height: initialHeight }: FamilyTreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: initialWidth || window.innerWidth,
    height: initialHeight || window.innerHeight,
  });
  const { width, height } = dimensions;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  //   Building hierarchy and Layout
  const rootLayout = useMemo(() => {
    const hRoot = hierarchy<TreeNode>(rootData, (d) => (collapsedIds.has(d.member_id) ? null : d.children || []));
    const layout = tree<TreeNode>().nodeSize([120, 220]);
    return layout(hRoot); // HierarchyPointNode<TreeNode>
  }, [collapsedIds, rootData]);

  const nodes = useMemo(() => rootLayout.descendants(), [rootLayout]);
  const links = useMemo(() => rootLayout.links(), [rootLayout]);

  const handleToggle = useCallback((node: HierarchyNode<TreeNode>) => {
    if (!node.data.children || node.data.children.length === 0) return;

    setCollapsedIds((prevCollapsedIds) => {
      const next = new Set(prevCollapsedIds);
      if (next.has(node.data.member_id)) next.delete(node.data.member_id);
      else next.add(node.data.member_id);
      return next;
    });
  }, []);

  // zoom with wheel (non-passive listener to prevent default page scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.001;
      setZoom((prevZoom) => Math.max(0.3, Math.min(2.5, prevZoom + delta)));
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  //pan with drag
  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    // setPan({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp: React.MouseEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging) return;
    setPan((prevPan) => ({ x: prevPan.x + e.movementX / zoom, y: prevPan.y + e.movementY / zoom }));
  };

  // Touch handling
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastPinchDistRef = useRef<number | null>(null);

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastPinchDistRef.current = dist;
    }
  };

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (e.touches.length === 1 && isDragging && lastTouchRef.current) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchRef.current.x;
      const deltaY = touch.clientY - lastTouchRef.current.y;
      setPan((prevPan) => ({ x: prevPan.x + deltaX / zoom, y: prevPan.y + deltaY / zoom }));
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2 && lastPinchDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - lastPinchDistRef.current;
      setZoom((prevZoom) => Math.max(0.3, Math.min(2.5, prevZoom + delta * 0.005)));
      lastPinchDistRef.current = dist;
    }
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
    lastTouchRef.current = null;
    lastPinchDistRef.current = null;
  };

  const cardWidth = 160;
  const cardHeight = 80;

  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden bg-background-secondary cursor-move touch-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg width="100%" height="100%" viewBox={`${-width / 2 - pan.x} ${-height / 2 - pan.y} ${width / zoom} ${height / zoom }`}>
          <g>
            {/* links */}
            {links.map((link, i) => (
              <path
                key={i}
                d={`
                M${link.source.y},${link.source.x}
                C${(link.source.y + link.target.y) / 2},${link.source.x}
                 ${(link.source.y + link.target.y) / 2},${link.target.x}
                 ${link.target.y},${link.target.x}
              `}
                fill="none"
                stroke="var(--color-text-primary)"
                strokeWidth="1.5"
              ></path>
            ))}

            {/* Nodes */}
            {nodes.map((node) => {
              const { x, y } = node;
              const d = node.data;
              const hasChildren = !!(d.children && d.children.length > 0);
              const isCollapsed = collapsedIds.has(d.member_id);
              // Generate a unique key based on the node's path to handle duplicate member_ids
              const uniqueKey = node.ancestors().map((n) => n.data.member_id).join('_');

              return (
                <g key={uniqueKey} transform={`translate(${y},${x})`}>
                  <foreignObject x={-cardWidth / 2} y={-cardHeight / 2} width={cardWidth} height={cardHeight}>
                    <div
                      className={` text-text-primary rounded-md shadow-sm border border-text-primary px-sm py-sm text-xs cursor-pointer
                        ${node.data.member?.gender === 'Female' ? 'bg-member-female' : node.data.member?.gender === 'Male' ? 'bg-member-male' : 'bg-highlight'}
                        `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(d);
                        handleToggle(node);
                      }}
                    >
                      <div className="font-semibold truncate">{d.full_name || d.member_id}</div>
                      {d.member?.birth_date && (
                        <div className="text-[10px] text-text-secondary">
                          {`(${new Date(d.member.birth_date).getFullYear()} – ${
                            d.member?.death_date ? new Date(d.member.death_date).getFullYear() : '…'
                          })`}
                        </div>
                      )}
                      <div className="mt-1 flex justify-between items-center text-[10px] text-text-secondary">
                        <span>{d.member?.profession ?? ''}</span>
                        {hasChildren && (
                          <button
                            className="text-action-primary hover:text-action-secondary "
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(node);
                            }}
                          >
                            {isCollapsed ? '+' : '–'}
                          </button>
                        )}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </>
  );
}
