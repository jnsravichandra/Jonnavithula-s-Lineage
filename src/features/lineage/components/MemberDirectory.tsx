import { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import * as d3 from 'd3';
import type { FamilyTreeDataType } from '../hooks';
import { useMemberDirectory } from '../hooks/useMemberDirectory';
import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import MemberDashboard from './MemberDashboard';

interface MemberDirectoryProps {
  familyTreeData: FamilyTreeDataType;
}

function MemberDirectory({ familyTreeData }: MemberDirectoryProps) {
  const { hierarchy, selectedMember, handleMemberClick } = useMemberDirectory(familyTreeData);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Expand the root node by default when hierarchy loads
  useEffect(() => {
    if (hierarchy?.data?.member_id) {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        next.add(hierarchy.data.member_id);
        return next;
      });
    }
  }, [hierarchy]);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (!hierarchy) return;
    const allIds = new Set<string>();
    hierarchy.each((node) => {
      if (node.children && node.children.length > 0) {
        allIds.add(node.data.member_id);
      }
    });
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const renderNode = (node: d3.HierarchyNode<TreeNode>) => {
    const member = node.data;
    const memberId = member.member_id;
    const fullName = [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ');
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(memberId);

    return (
      <li key={memberId} className="my-sm">
        <div className="flex items-center">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(memberId);
              }}
              className="p-xs hover:bg-background-secondary rounded mr-xs text-text-primary transition-colors duration-300 focus:outline-none"
            >
              {isExpanded ? <ChevronDownIcon className="w-6 h-6" /> : <ChevronRightIcon className="w-6 h-6" />}
            </button>
          ) : (
            <span className="w-6 mr-1"></span>
          )}
          <div
            onClick={() => handleMemberClick(memberId)}
            className={`cursor-pointer px-sm py-sm rounded hover:bg-accent-primary hover:text-background-primary transition-colors duration-300 flex-grow ${
              selectedMember?.member_id === member.member_id ? 'bg-accent-primary text-background-primary font-bold hover:text-text-primary' : ''
            }`}
          >
            {fullName}
          </div>
        </div>
        {hasChildren && (
          <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <ul className="pl-4 border-l-2 border-text-secondary ml-sm list-none">{node.children!.map((child: d3.HierarchyNode<TreeNode>) => renderNode(child))}</ul>
            </div>
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <div className="p-md flex gap-md">
        {/* Header, Directory List with Expand and Collapse All buttons */}
        <div className="w-1/3">
          <h1 className="text-2xl font-bold mb-4">Member Directory</h1>
          <div className="flex gap-2 mb-4">
            <button
              onClick={expandAll}
              // className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              className="px-sm py-sm text-sm font-medium text-text-primary bg-background-secondary rounded hover:bg-accent-primary hover:text-background-primary focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-sm py-sm text-sm font-medium text-text-primary bg-background-secondary rounded hover:bg-accent-primary hover:text-background-primary focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Collapse All
            </button>
          </div>
          <ul className="list-none pl-0 overflow-y-auto max-h-[70vh]">{hierarchy ? renderNode(hierarchy) : <p>No members found.</p>}</ul>
        </div>

        {/* Member Details Dashboard*/}
        <div className="w-2/3">
          <div>{selectedMember ? <MemberDashboard member={selectedMember} familyTreeData={familyTreeData} /> : <p>Select a member to see details.</p>}</div>
        </div>
      </div>
    </>
  );
}

export default MemberDirectory;
