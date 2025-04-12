import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { X } from "react-bootstrap-icons";
import { NodeProps, Position, useReactFlow } from "reactflow";
import CustomHandle from "./CustomHandle";

export default function CoreferenceResolution({ data: { label }, id }: NodeProps<{ label: string }>) {
  const { setNodes } = useReactFlow();

  return (
    <Flex
      borderRadius="24px"
      border="2px solid #5e5eff"
      alignItems="center"
      bg="white"
      p={2}
      width="220px"
    >
      <Box flex="1">
        <Text fontSize="small">{label || "Conference Resolution"}</Text>
      </Box>
      <IconButton
        aria-label="Delete Node"
        icon={<X />}
        color="red"
        bg="transparent"
        size="sm"
        onClick={() => setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id))}
      />
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="target" position={Position.Left} />
    </Flex>
  );
}
