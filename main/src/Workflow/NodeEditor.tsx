import React, { useState } from "react";
import { Box, Input, Text, Textarea, VStack } from "@chakra-ui/react";
import { Node, useReactFlow } from "reactflow";

interface NodeEditorProps {
  node: Node;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

export default function NodeEditor({ node, setNodes }: NodeEditorProps) {
  const [name, setName] = useState(node.data.text || "Unnamed Node");
  const [description, setDescription] = useState(node.data.description || "");

  const { setNodes: updateNodes } = useReactFlow();

  // ✅ Update node properties in real-time
  const updateNode = (field: string, value: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === node.id ? { ...n, data: { ...n.data, [field]: value } } : n
      )
    );
  };

  return (
    <Box p="4" bg="white" boxShadow="md" borderRadius="md">
      <Text fontSize="lg" fontWeight="bold" mb="2">
        Node Editor
      </Text>
      <VStack spacing="2" align="stretch">
        <Text fontSize="sm">Node Name:</Text>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            updateNode("text", e.target.value);
          }}
        />

        <Text fontSize="sm">Description:</Text>
        <Textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            updateNode("description", e.target.value);
          }}
        />
      </VStack>
    </Box>
  );
}
