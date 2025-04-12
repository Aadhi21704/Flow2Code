import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { X } from "react-bootstrap-icons";
import { NodeProps, Position, useReactFlow } from "reactflow";
import CustomHandle from "./CustomHandle";

export default function SentimentAnalysis({ data: { text }, id }: NodeProps<{ text: string }>) {
  const { setNodes } = useReactFlow();

  return (
    <Flex
      borderRadius="24px"
      border="2px solid #ff5e5e"
      alignItems="center"
      bg="white"
      p={2}
      width="200px"
    >
      <Box flex="1">
        <Text fontSize="small">{text || "Sentiment Analysis"}</Text>
      </Box>
      <IconButton
        aria-label="Delete Node"
        icon={<X />}
        color="red"
        bg="transparent"
        size="small"
        onClick={() => setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id))}
      />
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="target" position={Position.Left} />
    </Flex>
  );
}
