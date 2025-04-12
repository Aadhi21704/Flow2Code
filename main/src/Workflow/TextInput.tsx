import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Position } from "reactflow";
import CustomHandle from "./CustomHandle";

export default function TextInput({ data: { text } }: { data: { text: string } }) {
  return (
    <Flex
      borderRadius="24px"
      border="2px solid #5e5eff"
      alignItems="center"
      bg="white"
      p={2}
      width="180px"
    >
      <Box flex="1">
        <Text fontSize="small">{text || "Text Input"}</Text>
      </Box>
      <CustomHandle type="source" position={Position.Right} />
    </Flex>
  );
}
