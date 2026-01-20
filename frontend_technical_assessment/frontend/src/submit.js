//submit.js
// DAG Detection Algorithm

const isDAG = (nodes, edges) => {
  const adjList = {};
  const inDegree = {};
  
  // Initialize
  nodes.forEach(node => {
    adjList[node.id] = [];
    inDegree[node.id] = 0;
  });
  
  // Build adjacency list
  edges.forEach(edge => {
    adjList[edge.source].push(edge.target);
    inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
  });
  
  // Kahn's algorithm
  const queue = nodes.filter(node => inDegree[node.id] === 0).map(n => n.id);
  let count = 0;
  
  while (queue.length > 0) {
    const current = queue.shift();
    count++;
    
    adjList[current].forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }
  
  return count === nodes.length;
};

// Submit pipeline to backend
export const submitPipeline = async (nodes, edges) => {
  try {
    const response = await fetch('http://localhost:8000/pipelines/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodes: nodes,
        edges: edges
      })
    });
    
    if (!response.ok) {
      throw new Error('Backend request failed');
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.log('Backend not available, using local calculation');
    
    // Fallback: calculate locally
    const num_nodes = nodes.length;
    const num_edges = edges.length;
    const is_dag = isDAG(nodes, edges);
    
    return {
      num_nodes,
      num_edges,
      is_dag
    };
  }
};