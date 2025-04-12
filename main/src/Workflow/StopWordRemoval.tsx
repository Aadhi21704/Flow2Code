import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { X } from "react-bootstrap-icons";
import { NodeProps, Position, useReactFlow } from "reactflow";
import CustomHandle from "./CustomHandle";

export default function StopwordRemoval({ data: { text }, id }: NodeProps<{ text: string }>) {
  const { setNodes } = useReactFlow();

  return (
    <Flex borderRadius="24px" border="2px solid #5e5eff" alignItems="center" bg="white" p={2} width="180px">
      <Box flex="1">
        <Text fontSize="small">{text || "Stopword Removal"}</Text>
      </Box>
      <IconButton
        aria-label="Delete Node"
        icon={<X />}
        color="red"
        bg="transparent"
        size="small"
        onClick={() => setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id))}
      />
      <CustomHandle type="target" position={Position.Left} />
      <CustomHandle type="source" position={Position.Right} />
    </Flex>
  );
}
