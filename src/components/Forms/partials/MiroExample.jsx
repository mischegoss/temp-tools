// Create a data table component for nodes
const ProcessTable = ({ nodes }) => {
  // Sort nodes by id (which effectively means creation order)
  const sortedNodes = [...nodes].sort((a, b) => parseInt(a.id) - parseInt(b.id));
  
  const tableStyles = {
    container: {
      marginTop: '30px',
      padding: '20px',
      display: 'none', // Hidden in UI, will show in print
      backgroundColor: '#ffffff',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px',
      fontSize: '11px',
    },
    th: {
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
    },
    td: {
      border: '1px solid #ddd',
      padding: '8px',
      verticalAlign: 'top',
    },
    h3: {
      marginBottom: '10px',
      fontSize: '14px',
      fontWeight: 'bold',
    }
  };
  
  return (
    <div style={tableStyles.container} className="container-print process-table-container">
      <h3 style={tableStyles.h3}>Process Flow Documentation</h3>
      <table style={tableStyles.table}>
        <thead>
          <tr>
            <th style={tableStyles.th}>Step #</th>
            <th style={tableStyles.th}>Step Type</th>
            <th style={tableStyles.th}>Label</th>
            <th style={tableStyles.th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {sortedNodes.map((node, index) => (
            <tr key={node.id}>
              <td style={tableStyles.td}>{index + 1}</td>
              <td style={tableStyles.td}>{node.data.nodeType || (node.type === 'action' ? 'Action Step' : 'Decision Point')}</td>
              <td style={tableStyles.td}>{node.data.label}</td>
              <td style={tableStyles.td}>{node.data.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import React, { useState, useCallback, useRef, memo, useEffect } from 'react';
import { 
Form,
Button,
OverlayTrigger,
Tooltip,
Card
} from 'react-bootstrap';
import ReactFlow, { 
Background,
Controls,
addEdge,
useNodesState,
useEdgesState,
ReactFlowProvider,
Handle,
Position
} from 'reactflow';
import 'reactflow/dist/style.css';

// Add custom CSS for node styling and connection points
const customStyles = `
.react-flow__node {
  border: 1.5px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.node-content {
  padding: 4px !important;
  font-size: 0.48rem !important; /* Reduced by 40% from 0.8rem */
  white-space: break-spaces !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  word-break: break-word !important;
  text-align: center !important;
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

/* Bigger connection points */
.react-flow__handle {
  width: 12px !important;
  height: 12px !important;
  border-radius: 50% !important;
  background-color: #0ec0c0 !important;
  border: 2px solid white !important;
}

.react-flow__handle:hover {
  background-color: #0ba8a8 !important;
  transform: scale(1.2) !important;
  transition: all 0.2s ease !important;
  cursor: crosshair !important;
}

.react-flow__handle:hover::after {
  content: '+';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
}

/* Make connection lines always solid */
.react-flow__edge-path {
  stroke-width: 2px !important;
  stroke: #555 !important;
  stroke-dasharray: none !important;
}

/* Enhanced tooltips */
.tooltip {
  opacity: 1 !important;
  padding: 8px 12px !important;
  border-radius: 4px !important;
  font-size: 0.85rem !important;
  max-width: 220px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
}

.tooltip-inner {
  background-color: #333 !important;
  color: white !important;
  padding: 8px 12px !important;
  text-align: left !important;
}

.tooltip .arrow::before {
  border-top-color: #333 !important;
}

/* Add these specific styles to help domToImage */
.react-flow {
  width: 100% !important;
  height: 100% !important;
}

/* Draggable Toolbox Styles */
.floating-toolbox {
  position: fixed; /* Changed from absolute to fixed */
  z-index: 9999; /* Increased z-index to be above everything */
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 280px; /* Reduced from 320px */
  overflow: hidden;
  transition: all 0.3s ease;
}

.toolbox-header {
  padding: 8px 12px; /* Reduced padding */
  background-color: #0ec0c0;
  color: white;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  font-size: 14px; /* Smaller font */
}

.toolbox-content {
  padding: 12px; /* Reduced padding */
  max-height: 70vh; /* Limit height */
  overflow-y: auto;
}

.toolbox-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 24px;
  height: 24px;
}

.toolbox-minimized {
  width: 180px; /* Reduced minimized width */
  height: auto !important;
}

.toolbox-step {
  margin-bottom: 12px; /* Reduced margin */
  padding-bottom: 12px; /* Reduced padding */
  border-bottom: 1px solid #e0e0e0;
}

.toolbox-step:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* Reduced margin */
}

.step-number {
  width: 24px; /* Reduced from 28px */
  height: 24px; /* Reduced from 28px */
  border-radius: 50%;
  background-color: #0ec0c0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 8px; /* Reduced margin */
  font-size: 12px; /* Reduced font */
}

.step-title {
  font-weight: 500;
  font-size: 13px; /* Reduced font */
}

/* Full width canvas container */
.full-width-container {
  width: 100% !important;
  height: 9in !important;
}

/* Full width card */
.full-width-card {
  width: 100% !important;
  max-width: none !important;
}

/* Only hide no-print elements during printing */
@media print {
  .no-print {
    display: none !important;
  }
  
  /* Use fixed dimensions for printing */
  .miro-board-container {
    width: 7.5in !important;
    height: 9in !important;
    margin: 0 auto !important;
  }
  
  /* Show process table container in print */
  .process-table-container {
    display: block !important;
    break-inside: avoid;
    page-break-inside: avoid;
    margin-top: 20px;
  }
}
`;

// Decision Node component with triangular extensions on all four sides and connection points at triangle tips
const DecisionNode = memo(({ data, isConnectable }) => {
  // Calculate font size based on text length - reduced by 40%
  const calcFontSize = () => {
    const length = data.label?.length || 0;
    if (length > 50) return '0.36rem';
    if (length > 30) return '0.42rem';
    if (length > 15) return '0.45rem';
    return '0.48rem';
  };

  // Add tooltip for description
  const nodeTooltip = (props) => (
    <Tooltip id={`node-tooltip-${data.id}`} {...props}>
      {data.description || 'No description provided.'}
    </Tooltip>
  );

  // Get the background color from the node's style or data
  const backgroundColor = data.style?.backgroundColor || '#fa8c16';
  
  // Triangle size - middle size between original (12px) and larger (18px)
  const triangleSize = 15;
  
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={nodeTooltip}
    >
      <div style={{ 
        position: 'relative',
        width: '100%', 
        height: '100%'
      }}>
        {/* Center content with rounded rectangle */}
        <div className="node-content" style={{ 
          fontSize: calcFontSize(),
          backgroundColor: backgroundColor,
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          zIndex: 10
        }}>
          {data.label}
        </div>
        
        {/* Left triangle */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: -triangleSize,
          marginTop: -triangleSize,
          width: 0,
          height: 0,
          borderTop: `${triangleSize}px solid transparent`,
          borderBottom: `${triangleSize}px solid transparent`,
          borderRight: `${triangleSize}px solid ${backgroundColor}`,
          pointerEvents: 'none',
          zIndex: 5
        }}></div>
        
        {/* Right triangle */}
        <div style={{
          position: 'absolute',
          top: '50%',
          right: -triangleSize,
          marginTop: -triangleSize,
          width: 0,
          height: 0,
          borderTop: `${triangleSize}px solid transparent`,
          borderBottom: `${triangleSize}px solid transparent`,
          borderLeft: `${triangleSize}px solid ${backgroundColor}`,
          pointerEvents: 'none',
          zIndex: 5
        }}></div>
        
        {/* Top triangle */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: -triangleSize,
          marginLeft: -triangleSize,
          width: 0,
          height: 0,
          borderLeft: `${triangleSize}px solid transparent`,
          borderRight: `${triangleSize}px solid transparent`,
          borderBottom: `${triangleSize}px solid ${backgroundColor}`,
          pointerEvents: 'none',
          zIndex: 5
        }}></div>
        
        {/* Bottom triangle */}
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: -triangleSize,
          marginLeft: -triangleSize,
          width: 0,
          height: 0,
          borderLeft: `${triangleSize}px solid transparent`,
          borderRight: `${triangleSize}px solid transparent`,
          borderTop: `${triangleSize}px solid ${backgroundColor}`,
          pointerEvents: 'none',
          zIndex: 5
        }}></div>
        
        {/* Top connection handle at triangle tip - positioned slightly above the triangle */}
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ 
            zIndex: 20,
            top: -triangleSize - 2, // Move 2px above the triangle tip
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
        
        {/* Bottom connection handle at triangle tip - positioned slightly below the triangle */}
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{ 
            zIndex: 20,
            bottom: -triangleSize - 2, // Move 2px below the triangle tip
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
      </div>
    </OverlayTrigger>
  );
});

const ActionNode = memo(({ data, isConnectable }) => {
// Calculate font size based on text length - reduced by 40%
const calcFontSize = () => {
  const length = data.label?.length || 0;
  if (length > 50) return '0.36rem'; // 0.6 * 0.6
  if (length > 30) return '0.42rem'; // 0.7 * 0.6
  if (length > 15) return '0.45rem'; // 0.75 * 0.6
  return '0.48rem'; // 0.8 * 0.6
};

// Add tooltip for description
const nodeTooltip = (props) => (
  <Tooltip id={`node-tooltip-${data.id}`} {...props}>
    {data.description || 'No description provided.'}
  </Tooltip>
);

return (
  <OverlayTrigger
    placement="top"
    delay={{ show: 250, hide: 400 }}
    overlay={nodeTooltip}
  >
    <div style={{ width: '100%', height: '100%' }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="node-content" style={{ fontSize: calcFontSize() }}>
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  </OverlayTrigger>
);
});

// Draggable Toolbox Component - Extracted as a portal component
const FloatingToolbox = ({ children }) => {
const [position, setPosition] = useState({ x: 20, y: 60 }); // Adjusted initial position
const [isDragging, setIsDragging] = useState(false);
const [minimized, setMinimized] = useState(false);
const toolboxRef = useRef(null);
const dragStartPos = useRef({ x: 0, y: 0 });

// Handle mouse down for dragging
const handleMouseDown = (e) => {
  if (e.target.closest('.toolbox-toggle')) return;
  
  setIsDragging(true);
  dragStartPos.current = {
    x: e.clientX - position.x,
    y: e.clientY - position.y
  };
};

// Handle dragging
useEffect(() => {
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;
    
    // Keep toolbox within viewport bounds
    const rect = toolboxRef.current?.getBoundingClientRect();
    if (rect) {
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (isDragging) {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}, [isDragging]);

// Toggle minimized state
const toggleMinimized = () => {
  setMinimized(!minimized);
};

return (
  <div 
    ref={toolboxRef}
    className={`floating-toolbox no-print ${minimized ? 'toolbox-minimized' : ''}`}
    style={{ 
      left: `${position.x}px`, 
      top: `${position.y}px`,
      display: 'block' // Explicitly set display to ensure visibility
    }}
  >
    <div className="toolbox-header" onMouseDown={handleMouseDown}>
      <span>Process Flow Tools</span>
      <button className="toolbox-toggle" onClick={toggleMinimized}>
        {minimized ? '↓' : '↑'}
      </button>
    </div>
    {!minimized && (
      <div className="toolbox-content">
        {children}
      </div>
    )}
  </div>
);
};

// Define custom node types
const nodeTypes = {
decision: DecisionNode,
action: ActionNode,
};

const MiroExample = () => {
// Initial node - GREEN start node
const initialNodes = [
  {
    id: '1',
    type: 'action',
    data: { 
      label: 'Start/Trigger',
      description: 'The event or condition that triggers the start of this process.',
      nodeType: 'Start/Trigger',
      createdAt: new Date().toLocaleString()
    },
    position: { x: 250, y: 25 },
    style: { 
      backgroundColor: '#50C878', // Changed to green
      color: '#ffffff',
      borderRadius: '4px',
      padding: '8px 4px',
      minWidth: '90px',
      maxWidth: '90px',
      minHeight: '36px',
      maxHeight: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }
  },
];

// States for React Flow
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState([]);
const [nodeName, setNodeName] = useState('');
const [nodeDescription, setNodeDescription] = useState(''); // New state for description
const [nodeType, setNodeType] = useState('action'); // 'action' or 'decision'
const nodeId = useRef(2);
const [showToolbox, setShowToolbox] = useState(true); // Control visibility of the toolbox

// Tooltips for node types
const actionTooltip = (props) => (
  <Tooltip id="action-tooltip" {...props} style={{zIndex: 10000}}>
    Use for regular process steps or activities that don't require a decision
  </Tooltip>
);

const decisionTooltip = (props) => (
  <Tooltip id="decision-tooltip" {...props} style={{zIndex: 10000}}>
    Use for points where the process branches based on a condition or choice
  </Tooltip>
);

// Handler for connecting nodes with solid lines
const onConnect = useCallback(
  (params) => {
    const newEdge = {
      ...params,
      type: 'default',  // Default type for solid lines
      style: { stroke: '#555', strokeWidth: 2 }  // Styling for edge
    };
    setEdges((eds) => addEdge(newEdge, eds));
  },
  [setEdges]
);

// Handler for adding new nodes
const addNode = () => {
  if (!nodeName) return;
  
  // Position nodes in a structured way
  const lastNode = nodes[nodes.length - 1];
  const newX = lastNode ? lastNode.position.x + 50 : 250;
  const newY = lastNode ? lastNode.position.y + 70 : 25;
  
  // Set color based on node type
  const backgroundColor = nodeType === 'action' ? '#1890ff' : '#fa8c16'; // Blue for actions, Orange for decisions
  
  const newNode = {
    id: nodeId.current.toString(),
    type: nodeType,
    data: { 
      label: nodeName,
      description: nodeDescription || 'No description provided.', // Include description
      nodeType: nodeType === 'action' ? 'Action Step' : 'Decision Point', // For the table
      createdAt: new Date().toLocaleString(), // Capture creation timestamp
      style: { backgroundColor } // Pass background color to the node data
    },
    position: {
      x: newX,
      y: newY
    },
    style: {
      backgroundColor: backgroundColor,
      color: '#ffffff',
      borderRadius: '4px',
      padding: '8px 4px',
      minWidth: '90px',
      maxWidth: '90px',
      minHeight: '36px',
      maxHeight: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }
  };
  
  setNodes((nds) => [...nds, newNode]);
  setNodeName('');
  setNodeDescription(''); // Clear description after adding node
  nodeId.current++;
};

// Handler for deleting selected nodes
const deleteSelectedNodes = () => {
  setNodes((nds) => nds.filter((node) => !node.selected));
  setEdges((eds) => eds.filter((edge) => 
    !edge.selected &&
    nodes.find((node) => node.id === edge.source && !node.selected) &&
    nodes.find((node) => node.id === edge.target && !node.selected)
  ));
};

// Common style for action buttons to maintain consistency
const actionButtonStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  border: '1px solid #2563eb',
  marginLeft: '5px', 
  minWidth: '100px'
};

// Card styles for section
const cardStyles = {
  card: {
    marginBottom: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    width: '100%' // Make the card full width
  },
  cardHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
    padding: '1rem 1.5rem'
  },
  cardBody: {
    padding: '1.5rem'
  },
  h2: {
    color: '#2c3345',
    fontSize: '1.8rem',
    margin: 0,
    fontWeight: 600,
    lineHeight: 1.3
  }
};

// Toggle toolbox visibility
const toggleToolbox = () => {
  setShowToolbox(!showToolbox);
};

// Toolbar content
const toolboxContent = (
  <>
    {/* Step 1 */}
    <div className="toolbox-step">
      <div className="step-header">
        <div className="step-number">1</div>
        <div className="step-title">Select Step Type</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={actionTooltip}
        >
          <div 
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              flex: '1',
              marginRight: '5px',
              backgroundColor: nodeType === 'action' ? '#2563eb' : '#f8f9fa',
              color: nodeType === 'action' ? 'white' : '#333',
              border: '1px solid #d1d5db',
              textAlign: 'center'
            }}
            onClick={() => setNodeType('action')}
          >
            Action Step
          </div>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={decisionTooltip}
        >
          <div 
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              flex: '1',
              backgroundColor: nodeType === 'decision' ? '#fa8c16' : '#f8f9fa',
              color: nodeType === 'decision' ? 'white' : '#333',
              border: '1px solid #d1d5db',
              textAlign: 'center'
            }}
            onClick={() => setNodeType('decision')}
          >
            Decision Point
          </div>
        </OverlayTrigger>
      </div>
    </div>
    
    {/* Step 2 */}
    <div className="toolbox-step">
      <div className="step-header">
        <div className="step-number">2</div>
        <div className="step-title">Add Label</div>
      </div>
      <Form.Control
        type="text"
        value={nodeName}
        onChange={(e) => setNodeName(e.target.value)}
        placeholder="Enter step description"
        style={{
          marginTop: '8px',
          padding: '8px 12px',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          width: '100%'
        }}
      />
    </div>
    
    {/* Step 3 - Add Description */}
    <div className="toolbox-step">
      <div className="step-header">
        <div className="step-number">3</div>
        <div className="step-title">Add Description</div>
      </div>
      <Form.Control
        as="textarea"
        rows={2}
        value={nodeDescription}
        onChange={(e) => setNodeDescription(e.target.value)}
        placeholder="Enter detailed description (will appear on hover)"
        style={{
          marginTop: '8px',
          padding: '8px 12px',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          width: '100%'
        }}
      />
    </div>
    
    {/* Step 4 */}
    <div className="toolbox-step">
      <div className="step-header">
        <div className="step-number">4</div>
        <div className="step-title">Add to Canvas</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <Button 
          onClick={addNode}
          variant="outline-primary"
          disabled={!nodeName}
          style={{
            ...actionButtonStyle,
            flex: '1',
            marginLeft: '0',
            marginRight: '5px',
            backgroundColor: nodeName ? '#2563eb' : '#f8f9fa',
            color: nodeName ? 'white' : '#2563eb'
          }}
        >
          Add Step
        </Button>
        <Button 
          variant="outline-primary"
          onClick={deleteSelectedNodes}
          style={{
            ...actionButtonStyle,
            flex: '1',
            marginLeft: '0'
          }}
        >
          Delete Selected
        </Button>
      </div>
    </div>
  </>
);

return (
  <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
    {/* Add global styles */}
    <style dangerouslySetInnerHTML={{ __html: customStyles }} />
    
    {/* Card with ReactFlow - now full width */}
    <Card className="section full-width-card" style={cardStyles.card}>
      <Card.Header style={cardStyles.cardHeader}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ ...cardStyles.h2, fontSize: '1.4rem' }}>Create a Visualization of Your Process</h2>
          {/* Toggle button for toolbox */}
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) => (
              <Tooltip id="toggle-tools-tooltip" {...props}>
                Show or hide the Process Flow Tools panel
              </Tooltip>
            )}
          >
            <Button 
              variant="outline-primary"
              onClick={toggleToolbox}
              className="no-print"
              style={{
                padding: '6px 12px',
                fontSize: '0.85rem',
                marginLeft: '10px'
              }}
            >
              {showToolbox ? 'Hide Tools' : 'Show Tools'}
            </Button>
          </OverlayTrigger>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
          <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
            <li>Drag the Process Flow Tools component to move it.</li>
            <li>The Hide/Show button toggles the Process Flow Tool.</li>
            <li>To make a connection, hover over the teal connection point until "+" appears, then click and drag from one node's connection point to another.</li>
            <li>Have questions? Ask RANI for support.</li>
          </ul>
        </div>
      </Card.Header>
      <Card.Body style={cardStyles.cardBody}>
        {/* Full width container for the diagram */}
        <div className="miro-board-container full-width-container" style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '6px',
          overflow: 'hidden',
          background: 'white', // Ensure white background for dom-to-image
          position: 'relative', // Ensure proper rendering of children
          marginBottom: '15px' // Add some spacing below
        }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            multiSelectionKeyCode={['Control', 'Meta']}
            selectionKeyCode={['Shift']}
            defaultEdgeOptions={{
              style: { stroke: '#555', strokeWidth: 2 }
            }}
            className="react-flow"
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        
        {/* Add the hidden process table component - will only appear in PDF */}
        <ProcessTable nodes={nodes} />

      </Card.Body>
    </Card>
    
    {/* Floating toolbox outside the ReactFlow container */}
    {showToolbox && (
      <FloatingToolbox>
        {toolboxContent}
      </FloatingToolbox>
    )}
  </div>
);
};

// Wrap the component with ReactFlowProvider
const MiroExampleWithProvider = () => (
  <ReactFlowProvider>
    <MiroExample />
  </ReactFlowProvider>
);

export default MiroExampleWithProvider;