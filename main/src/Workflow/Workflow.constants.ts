import { Node, Edge } from "reactflow";

// Initial Nodes as Text Input
export const initialNodes: Node[] = [
  {
    id: "1",
    type: "textInput",
    position: { x: 100, y: 100 },
    data: { text: "Input Text" }, // ✅ Ensure text data is set
  }
];


export const initialEdges: Edge[] = [];
