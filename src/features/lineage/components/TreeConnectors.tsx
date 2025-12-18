interface TreeConnectorsProps {
  type: 'parent-to-children' | 'sibling-connector' | 'child-vertical';
}

export const TreeConnectors = ({ type }: TreeConnectorsProps) => {

    const baseLineClasses = "absolute border-gray-500 transform -translate-x-1/2";
    switch (type) {
        case 'parent-to-children':
            // Renders the vertical line connecting the parent group to the horizontal sibling line.
            return (
                <div 
                    className={`top-0 left-1/2 w-0 h-6 border-l-2 ${baseLineClasses}`}
                    title="Parent-to-Children Vertical Connector"
                ></div>
            );
            
        case 'sibling-connector':
            // Renders the horizontal line that connects all the sibling branches.
            // Note: It needs to be inside a flex container to span the correct width.
            return (
                <div 
                    className="absolute top-0 w-full h-0 border-t-2 border-gray-500"
                    title="Sibling Horizontal Connector"
                ></div>
            );
            
        case 'child-vertical':
            // Renders the vertical line that drops down to a specific child's family group.
            return (
                <div 
                    className={`top-0 left-1/2 w-0 h-6 border-l-2 ${baseLineClasses}`}
                    title="Child Vertical Drop Line"
                ></div>
            );
            
        default:
            return null;
    }
};
