from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import defaultdict, deque

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Edge(BaseModel):
    id: str
    source: str
    target: str

class PipelineData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph is a Directed Acyclic Graph (DAG)
    using Kahn's algorithm (topological sort)
    """
    # Build adjacency list and in-degree map
    adjacency_list = defaultdict(list)
    in_degree = defaultdict(int)
    
    # Initialize all nodes with in-degree 0
    for node in nodes:
        if node.id not in in_degree:
            in_degree[node.id] = 0
    
    # Build the graph
    for edge in edges:
        adjacency_list[edge.source].append(edge.target)
        in_degree[edge.target] += 1
    
    # Find all nodes with in-degree 0
    queue = deque([node.id for node in nodes if in_degree[node.id] == 0])
    processed_count = 0
    
    # Process nodes with in-degree 0
    while queue:
        current = queue.popleft()
        processed_count += 1
        
        # Reduce in-degree for neighbors
        for neighbor in adjacency_list[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If all nodes are processed, it's a DAG
    return processed_count == len(nodes)

@app.get("/")
async def root():
    return {"message": "VectorShift Backend API is running!"}

@app.post("/pipelines/parse")
async def parse_pipeline(pipeline: PipelineData):
    """
    Parse the pipeline and return analysis results
    
    Returns:
        - num_nodes: Number of nodes in the pipeline
        - num_edges: Number of edges in the pipeline
        - is_dag: Whether the pipeline forms a valid DAG
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag_result = is_dag(pipeline.nodes, pipeline.edges)
    
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag_result
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)