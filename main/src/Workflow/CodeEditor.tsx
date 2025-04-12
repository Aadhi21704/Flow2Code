import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { Box, Button, Text, VStack, Spinner } from "@chakra-ui/react";
import { executePythonCode } from "../api/api"; // ✅ FIXED this line

interface CodeEditorProps {
  code: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code }) => {
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runCode = async () => {
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const response = await executePythonCode(code);
      setOutput(response.output);
    } catch (err: any) {
      setError("An error occurred while executing the code.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Box border="1px solid gray" borderRadius="5px" p={2} bg="black">
        <CodeMirror
          value={code}
          extensions={[python()]}
          theme="dark"
          readOnly
          basicSetup={{ lineNumbers: true }}
        />
      </Box>

      <Button colorScheme="teal" onClick={runCode} isDisabled={loading}>
        {loading ? <Spinner size="sm" mr={2} /> : null}
        {loading ? "Running..." : "Run Code"}
      </Button>

      {output && (
        <Box
          border="1px solid #ccc"
          borderRadius="md"
          p={3}
          bg="gray.50"
          whiteSpace="pre-wrap"
        >
          <Text fontWeight="bold" mb={2}>
            Output:
          </Text>
          <Text>{output}</Text>
        </Box>
      )}

      {error && (
        <Box color="red.500" fontWeight="medium">
          {error}
        </Box>
      )}
    </VStack>
  );
};

export default CodeEditor;
