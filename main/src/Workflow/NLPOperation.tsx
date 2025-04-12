import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { X, Pencil } from "react-bootstrap-icons";
import { NodeProps, Position, useReactFlow } from "reactflow";
import CustomHandle from "./CustomHandle";

export default function NLPOperation({ data, id }: NodeProps<{ operation: string }>) {
  const { setNodes } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [taskName, setTaskName] = useState(data.operation || "NLP Task");

  const handleEdit = () => setEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  const handleBlur = () => {
    setEditing(false);
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { operation: taskName } } : node
      )
    );
  };

  return (
    <Flex
      borderRadius="24px"
      border="2px solid #ffa500"
      alignItems="center"
      bg="white"
      p={2}
      width="200px"
    >
      <CustomHandle type="target" position={Position.Left} />
      <Box flex="1">
        {editing ? (
          <Input
            value={taskName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            size="sm"
          />
        ) : (
          <Box fontSize="small" onDoubleClick={handleEdit} style={{ cursor: "pointer" }}>
            {taskName}
          </Box>
        )}
      </Box>
      <IconButton
        aria-label="Edit Task"
        icon={<Pencil />}
        color="blue"
        bg="transparent"
        size="sm"
        onClick={handleEdit}
      />
      {/* Only show delete button for NLP tasks, NOT for "Input Text" */}
      {data.operation !== "Input Text" && (
        <IconButton
          aria-label="Delete Node"
          icon={<X />}
          color="red"
          bg="transparent"
          size="sm"
          onClick={() => setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id))}
        />
      )}
      <CustomHandle type="source" position={Position.Right} />
    </Flex>
  );
}
