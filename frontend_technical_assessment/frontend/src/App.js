import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import BaseNode from './nodes/BaseNode';
import TextNode from './nodes/TextNode';
import { submitPipeline } from './submit';
import './App.css';

// Node type configurations
const nodeConfigs = {
  input: {
    label: 'Input',
    icon: '📥',
    description: 'Data input node',
    fields: [
      { name: 'inputName', type: 'text', label: 'Name', placeholder: 'Enter input name', defaultValue: 'input' }
    ],
    color: 'bg-green-50',
    borderColor: 'border-green-400'
  },
  output: {
    label: 'Output',
    icon: '📤',
    description: 'Data output node',
    fields: [
      { name: 'outputName', type: 'text', label: 'Name', placeholder: 'Enter output name', defaultValue: 'output' }
    ],
    color: 'bg-red-50',
    borderColor: 'border-red-400'
  },
  llm: {
    label: 'LLM',
    icon: '🤖',
    description: 'Large Language Model',
    fields: [
      {
        name: 'model',
        type: 'select',
        label: 'Model',
        options: [
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'gpt-3.5', label: 'GPT-3.5' },
          { value: 'claude', label: 'Claude' }
        ],
        defaultValue: 'gpt-4'
      }
    ],
    color: 'bg-purple-50',
    borderColor: 'border-purple-400'
  },
  transform: {
    label: 'Transform',
    icon: '⚙️',
    description: 'Transform data',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'uppercase', label: 'Uppercase' },
          { value: 'lowercase', label: 'Lowercase' },
          { value: 'trim', label: 'Trim' }
        ],
        defaultValue: 'uppercase'
      }
    ],
    color: 'bg-yellow-50',
    borderColor: 'border-yellow-400'
  },
  filter: {
    label: 'Filter',
    icon: '🔍',
    description: 'Filter data',
    fields: [
      { name: 'condition', type: 'text', label: 'Condition', placeholder: 'e.g., value > 10' }
    ],
    color: 'bg-blue-50',
    borderColor: 'border-blue-400'
  }
};

// Node type components
const nodeTypes = {
  text: TextNode,
  ...Object.keys(nodeConfigs).reduce((acc, key) => {
    acc[key] = (props) => <BaseNode {...props} config={nodeConfigs[key]} />;
    return acc;
  }, {})
};

// Initial nodes and edges
const initialNodes = [
  { id: '1', type: 'input', position: { x: 100, y: 100 }, data: {} },
  { id: '2', type: 'text', position: { x: 400, y: 100 }, data: { text: 'Enter text with {{variables}}' } },
  { id: '3', type: 'output', position: { x: 700, y: 100 }, data: {} }
];

const initialEdges = [];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Delete key press
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Delete') {
        e.preventDefault();

        const hasSelectedNodes = nodes.some((n) => n.selected);
        const hasSelectedEdges = edges.some((e2) => e2.selected);

        if (hasSelectedNodes) {
          setNodes((nds) => nds.filter((n) => !n.selected));
        }

        if (hasSelectedEdges) {
          setEdges((eds) => eds.filter((e2) => !e2.selected));
        }
      }
    },
    [nodes, edges, setNodes, setEdges]
  );

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitPipeline(nodes, edges);
    setIsSubmitting(false);
    
    if (result) {
      alert(
        `Pipeline Analysis:\n\n` +
        `Number of Nodes: ${result.num_nodes}\n` +
        `Number of Edges: ${result.num_edges}\n` +
        `Is Valid DAG: ${result.is_dag ? '✅ Yes' : '❌ No'}\n\n` +
        `${result.is_dag ? 'Your pipeline is valid!' : 'Warning: Your pipeline contains cycles!'}`
      );
    }
  };

  const addNode = (type) => {
    const newNode = {
      id: `${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: type === 'text' ? { text: '' } : {}
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls />
        <MiniMap />
        
        <Panel position="top-left" className="panel">
          <h2 className="panel-title">VectorShift Pipeline Builder</h2>
          <div className="button-group">
            <button onClick={() => addNode('input')} className="btn btn-green">
              ➕ Add Input
            </button>
            <button onClick={() => addNode('llm')} className="btn btn-purple">
              ➕ Add LLM
            </button>
            <button onClick={() => addNode('text')} className="btn btn-indigo">
              ➕ Add Text
            </button>
            <button onClick={() => addNode('transform')} className="btn btn-yellow">
              ➕ Add Transform
            </button>
            <button onClick={() => addNode('filter')} className="btn btn-blue">
              ➕ Add Filter
            </button>
            <button onClick={() => addNode('output')} className="btn btn-red">
              ➕ Add Output
            </button>
          </div>
        </Panel>
        
        <Panel position="top-right" className="panel">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-submit"
          >
            {isSubmitting ? '⏳ Analyzing...' : '🚀 Submit Pipeline'}
          </button>
          <div className="stats">
            Nodes: {nodes.length} | Edges: {edges.length}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
            💡 Tip: Press <strong>Delete</strong> key to remove selected nodes/edges
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;
