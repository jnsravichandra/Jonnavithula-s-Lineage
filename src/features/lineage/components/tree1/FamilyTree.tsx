import { useEffect, useRef, useState } from 'react';
import type { FamilyTreeDataType } from '../../hooks';
import type { PersonCardActionType } from '../../types';
import FamilyTreeCanvas from './FamilyTreeCanvas';

interface FamilyTreeViewProps {
  familyTreeData: FamilyTreeDataType;
  personCardActions: PersonCardActionType;
}

export default function FamilyTreeView1({ familyTreeData }: FamilyTreeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-[75vh] w-full overflow-hidden">
      {familyTreeData.hierarchy && <FamilyTreeCanvas rootData={familyTreeData.hierarchy?.data} width={width} height={height} />}
    </div>
  );
}
