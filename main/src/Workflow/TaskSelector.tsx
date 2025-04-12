import React from "react";
import { Button, VStack } from "@chakra-ui/react";
import { useReactFlow } from "reactflow";
import { v4 as uuidv4 } from "uuid";

// Explicitly define NLP task types (Text Input removed)
const NLP_TASKS = {
  "Named Entity Recognition": "namedEntityRecognition",
  "Sentiment Analysis": "sentimentAnalysis",
  "Text Summarization": "textSummarization",
  "Tokenization": "tokenization",
  "Stemming": "stemming",
  "Lemmatization": "lemmatization",
  "POS Tagging": "posTagging",
  "Stopword Removal": "stopwordRemoval",
  "Dependency Parsing": "dependencyParsing",
  "Text Classification": "textClassification",
  "Coreference Resolution": "coreferenceResolution",
  "Keyword Extraction": "keywordExtraction",
} as const; // Read-only object

// Extract valid keys from NLP_TASKS
type TaskName = keyof typeof NLP_TASKS;

export default function TaskSelector() {
  const { setNodes } = useReactFlow();

  const addTaskNode = (taskName: TaskName) => {
    const type = NLP_TASKS[taskName];

    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: uuidv4(),
        type,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { text: taskName },
      },
    ]);
  };

  return (
    <VStack
      spacing={2}
      padding={4}
      background="white"
      borderRadius="md"
      boxShadow="md"
      width="250px"
      align="stretch"
    >
      <h3 style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
        Select NLP Task
      </h3>
      {Object.keys(NLP_TASKS).map((task) => (
        <Button
          key={task}
          onClick={() => addTaskNode(task as TaskName)}
          colorScheme="blue"
          size="sm"
        >
          {task}
        </Button>
      ))}
    </VStack>
  );
}
