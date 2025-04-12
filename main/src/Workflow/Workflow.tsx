import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import TextInput from "./TextInput";
import {
  Box,
  Button,
  Divider,
  Heading,
  IconButton,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { initialEdges, initialNodes } from "./Workflow.constants";
import TaskSelector from "./TaskSelector";
import NodeEditor from "./NodeEditor";
import CustomEdge from "./CustomEdge";
import NamedEntityRecognition from "./NamedEntityRecognition";
import SentimentAnalysis from "./SentimentAnalysis";
import TextSummarization from "./TextSummarization";
import Tokenization from "./Tokenization";
import Stemming from "./Stemming";
import Lemmatization from "./Lemmatization";
import POSTagging from "./POSTagging";
import StopwordRemoval from "./StopWordRemoval";
import DependencyParsing from "./DependencyParsing";
import TextClassification from "./TextClassification";
import KeywordExtraction from "./KeywordExtraction";
import CoreferenceResolution from "./CoreferenceResolution";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

const nodeTypes = {
  textInput: TextInput,
  namedEntityRecognition: NamedEntityRecognition,
  sentimentAnalysis: SentimentAnalysis,
  textSummarization: TextSummarization,
  tokenization: Tokenization,
  stemming: Stemming,
  lemmatization: Lemmatization,
  posTagging: POSTagging,
  stopwordRemoval: StopwordRemoval,
  dependencyParsing: DependencyParsing,
  textClassification: TextClassification,
  coreferenceResolution: CoreferenceResolution,
  keywordExtraction: KeywordExtraction,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export const Workflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [pythonCode, setPythonCode] = useState<string>("");
  const [showCode, setShowCode] = useState(false);
  const [codePanelWidth, setCodePanelWidth] = useState(500);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  const toast = useToast();

  const isCycle = (source: string, target: string): boolean => {
    const adjacencyList: Record<string, string[]> = {};
    edges.forEach((edge) => {
      if (!adjacencyList[edge.source]) adjacencyList[edge.source] = [];
      adjacencyList[edge.source].push(edge.target);
    });

    const hasCycle = (node: string, visited: Set<string>): boolean => {
      if (visited.has(node)) return true;
      visited.add(node);
      if (adjacencyList[node]) {
        for (let neighbor of adjacencyList[node]) {
          if (hasCycle(neighbor, new Set(visited))) return true;
        }
      }
      return false;
    };

    return hasCycle(target, new Set([source]));
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (!sourceNode || !targetNode) return;

      if (connection.source === connection.target) {
        toast({
          title: "Invalid Connection",
          description: "A node cannot connect to itself.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (
        edges.some(
          (edge) =>
            edge.source === connection.source &&
            edge.target === connection.target
        )
      ) {
        toast({
          title: "Duplicate Connection",
          description: "This connection already exists.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (isCycle(connection.source, connection.target)) {
        toast({
          title: "Invalid Connection",
          description: "This connection would create a cycle.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const edge = {
        ...connection,
        animated: true,
        id: `${edges.length + 1}`,
        type: "customEdge",
      };

      setEdges((prevEdges) => addEdge(edge, prevEdges));
    },
    [edges, nodes, setEdges, toast]
  );

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node);
  };

  const exportToJson = () => {
    const pipelineData = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };

    const jsonString = JSON.stringify(pipelineData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nlp_pipeline.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePythonScript = (workflow: any) => {
    const { nodes, edges } = workflow;
  
    const graph: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};
    const nodeMap: Record<string, any> = {};
  
    nodes.forEach((node: any) => {
      graph[node.id] = [];
      nodeMap[node.id] = node;
    });
  
    edges.forEach((edge: any) => {
      if (graph[edge.source]) {
        graph[edge.source].push(edge.target);
        inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
      }
    });
  
    const startNodes = nodes.filter(
      (n: any) => n.type === 'textInput' && !inDegree[n.id]
    );
  
    const queue = [...startNodes];
    const visited = new Set<string>();
    const executionOrder: any[] = [];
    const usedTypes = new Set<string>();
  
    while (queue.length > 0) {
      const currentNode = queue.shift();
      if (!currentNode || visited.has(currentNode.id)) continue;
      visited.add(currentNode.id);
      executionOrder.push(currentNode);
      usedTypes.add(currentNode.type);
  
      const neighbors = graph[currentNode.id] || [];
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          queue.push(nodeMap[neighborId]);
        }
      }
    }
  
    // === Start code generation ===
  
    let script = `import spacy\n\n# Load spaCy model\nnlp = spacy.load("en_core_web_sm")\n\n`;
  
    // Handle text input node
    const inputNode = executionOrder.find((n) => n.type === 'textInput');
    const sampleText = inputNode?.data?.label || 'SpaCy is an amazing NLP library!';
    script += `# Sample text input\ntext = "${sampleText}"\ndoc = nlp(text)\n\n`;
  
    // Function implementations (only those needed)
    const functionMap: Record<string, string> = {
      tokenization: [
        "def tokenization(doc):",
        "    return [token.text for token in doc]"
      ].join('\n'),
    
      posTagging: [
        "def pos_tagging(doc):",
        "    return [(token.text, token.pos_) for token in doc]"
      ].join('\n'),
    
      namedEntityRecognition: [
        "def named_entity_recognition(doc):",
        "    return [(ent.text, ent.label_) for ent in doc.ents]"
      ].join('\n'),
    
      stopwordRemoval: [
        "def stopword_removal(doc):",
        "    return [token.text for token in doc if not token.is_stop]"
      ].join('\n'),
    
      lemmatization: [
        "def lemmatization(doc):",
        "    return [token.lemma_ for token in doc]"
      ].join('\n'),
    
      sentimentAnalysis: [
        "from textblob import TextBlob",
        "",
        "def sentiment_analysis(text):  # expects plain string",
        "    blob = TextBlob(text)",
        "    return blob.sentiment"
      ].join('\n'),
    
      dependencyParsing: [
        "def dependency_parsing(doc):",
        "    return [(token.text, token.dep_, token.head.text) for token in doc]"
      ].join('\n'),
    
      textClassification: [
        "from textblob import TextBlob",
        "",
        "def text_classification(text):  # expects plain string",
        "    blob = TextBlob(text)",
        "    polarity = blob.sentiment.polarity",
        "    if polarity > 0.1:",
        "        return 'Positive'",
        "    elif polarity < -0.1:",
        "        return 'Negative'",
        "    else:",
        "        return 'Neutral'"
      ].join('\n'),
    
      coreferenceResolution: [
        "def coreference_resolution(doc):",
        "    return \"Coreference Resolution: Not implemented in spaCy by default\""
      ].join('\n'),
    
      keywordExtraction: [
        "def keyword_extraction(doc):",
        "    return list(set([token.lemma_ for token in doc if token.is_alpha and not token.is_stop]))"
      ].join('\n'),
    
      stemming: [
        "from nltk.stem import PorterStemmer",
        "import nltk",
        "nltk.download('punkt')",
        "stemmer = PorterStemmer()",
        "",
        "def stemming(doc):",
        "    return [stemmer.stem(token.text) for token in doc]"
      ].join('\n'),
    
      textSummarization: [
        "from sumy.parsers.plaintext import PlaintextParser",
        "from sumy.nlp.tokenizers import Tokenizer",
        "from sumy.summarizers.lsa import LsaSummarizer",
        "",
        "def text_summarization(text):  # expects plain string",
        "    if len(text.split()) < 10:",
        "        return 'Text too short to summarize'",
        "    parser = PlaintextParser.from_string(text, Tokenizer('english'))",
        "    summarizer = LsaSummarizer()",
        "    summary = summarizer(parser.document, 2)",
        "    return ' '.join(str(sentence) for sentence in summary)"
      ].join('\n')
    };
    
    
    
    
    
  
    const functions = Array.from(usedTypes)
      .map((type) => functionMap[type])
      .filter(Boolean)
      .join('\n');
  
    script += `# Define pipeline functions\n${functions}\n\n`;
  
    // Execution based on node type
    let resultCode = '';
    let printCode = '';
    for (const node of executionOrder) {
      switch (node.type) {
        case 'tokenization':
          resultCode += `tokens = tokenization(doc)\n`;
          printCode += `print("Tokens:", tokens)\n`;
          break;
        case 'posTagging':
          resultCode += `pos_tags = pos_tagging(doc)\n`;
          printCode += `print("POS Tags:", pos_tags)\n`;
          break;
        case 'namedEntityRecognition':
          resultCode += `ner = named_entity_recognition(doc)\n`;
          printCode += `print("NER:", ner)\n`;
          break;
        case 'stopwordRemoval':
          resultCode += `filtered_tokens = stopword_removal(doc)\n`;
          printCode += `print("Filtered Tokens:", filtered_tokens)\n`;
          break;
        case 'lemmatization':
          resultCode += `lemmas = lemmatization(doc)\n`;
          printCode += `print("Lemmas:", lemmas)\n`;
          break;
        case 'sentimentAnalysis':
          resultCode += `sentiment = sentiment_analysis(text)\n`;  // ✅ FIXED
          printCode += `print("Sentiment:", sentiment)\n`;
          break;
        case 'dependencyParsing':
          resultCode += `dependencies = dependency_parsing(doc)\n`;
          printCode += `print("Dependencies:", dependencies)\n`;
          break;
        case 'textClassification':
          resultCode += `classification = text_classification(text)\n`;  // ✅ FIXED
          printCode += `print("Classification:", classification)\n`;
          break;
        case 'coreferenceResolution':
          resultCode += `coref_result = coreference_resolution(doc)\n`;
          printCode += `print("Coreference Resolution:", coref_result)\n`;
          break;
        case 'keywordExtraction':
          resultCode += `keywords = keyword_extraction(doc)\n`;
          printCode += `print("Keywords:", keywords)\n`;
          break;
        case 'stemming':
          resultCode += `stems = stemming(doc)\n`;
          printCode += `print("Stems:", stems)\n`;
          break;
        case 'textSummarization':
          resultCode += `summary = text_summarization(text)\n`;  // ✅ FIXED
          printCode += `print("Summary:", summary)\n`;
          break;
      }
      
    }
  
    script += `# Run the pipeline\n${resultCode}\n# Print results\nprint("Results:")\n${printCode}`;
  
    return script;
  };
  
  

  const showPythonScript = () => {
    const workflow = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };

    const script = generatePythonScript(workflow);
    setPythonCode(script);
  };

  return (
    <Box height="100vh" width="100%" display="flex" flexDirection="row">
      {/* Sidebar */}
      {showSidebar ? (
        <Box width="300px" p={4} bg="gray.100" borderRight="1px solid #ccc" position="relative">
          <IconButton
            aria-label="Hide Sidebar"
            icon={<ChevronLeftIcon />}
            size="sm"
            variant="ghost"
            position="absolute"
            top="50%"
            right="-15px"
            transform="translateY(-50%)"
            zIndex="10"
            onClick={() => setShowSidebar(false)}
          />
          <VStack align="stretch" spacing={4}>
            <Box>
              <Heading as="h4" size="sm" mb={2}>Tasks</Heading>
              <TaskSelector />
            </Box>
            <Divider />
            <Box>
              <Heading as="h4" size="sm" mb={2}>Actions</Heading>
              <VStack spacing={2} align="stretch">
                <Button colorScheme="green" size="sm" onClick={exportToJson}>Export to JSON</Button>
                <Button colorScheme="blue" size="sm" onClick={showPythonScript}>Generate Python Script</Button>
                <Button colorScheme="purple" size="sm" onClick={() => setShowCode((prev) => !prev)}>
                  {showCode ? "Hide Code" : "Show Code"}
                </Button>
                <Button colorScheme="pink" size="sm" onClick={() => setIsReadOnly((prev) => !prev)}>
                  {isReadOnly ? "Enable Editing" : "Disable Editing"}
                </Button>
              </VStack>
            </Box>
            <Divider />
            {selectedNode && (
              <Box>
                <Heading as="h4" size="sm" mb={2}>Node Settings</Heading>
                <NodeEditor node={selectedNode} setNodes={setNodes} />
              </Box>
            )}
          </VStack>
        </Box>
      ) : (
        <Box width="40px" bg="gray.100" borderRight="1px solid #ccc" display="flex" alignItems="center" justifyContent="center">
          <IconButton
            aria-label="Show Sidebar"
            icon={<ChevronRightIcon />}
            size="sm"
            variant="ghost"
            onClick={() => setShowSidebar(true)}
          />
        </Box>
      )}

      {/* Main Canvas */}
      <Box flex="1" display="flex" position="relative">
        <Box flex="1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            onNodeClick={onNodeClick}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Box>

        {/* Resizable Divider */}
        {showCode && (
          <Box
            width="5px"
            cursor="col-resize"
            bg="gray.400"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = codePanelWidth;

              const handleMouseMove = (e: MouseEvent) => {
                const newWidth = startWidth - (e.clientX - startX);
                if (newWidth > 200 && newWidth < window.innerWidth - 300) {
                  setCodePanelWidth(newWidth);
                }
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          />
        )}

        {/* Code Panel */}
        {showCode && (
          <Box
            id="code-editor-panel"
            width={`${codePanelWidth}px`}
            height="100vh"
            p={4}
            borderLeft="1px solid #ccc"
            bg="black"
            display="flex"
            flexDirection="column"
          >
            <Box mb={2} display="flex" gap={2} flexWrap="wrap">
              <Button size="sm" colorScheme="teal" onClick={() => navigator.clipboard.writeText(pythonCode)}>Copy</Button>
              <Button size="sm" colorScheme="orange" onClick={() => {
                const blob = new Blob([pythonCode], { type: "text/x-python" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "nlp_pipeline.py";
                link.click();
              }}>Download</Button>
              <Button size="sm" colorScheme="yellow" onClick={() => {
                const panel = document.getElementById("code-editor-panel");
                if (panel?.requestFullscreen) panel.requestFullscreen();
              }}>Fullscreen</Button>
              <Button size="sm" colorScheme="pink" onClick={() => setIsReadOnly((prev) => !prev)}>
                {isReadOnly ? "Enable Editing" : "Disable Editing"}
              </Button>
            </Box>

            <Box flex="1" borderRadius="md" overflow="hidden" border="1px solid #444">
              <CodeMirror
                value={pythonCode}
                height="100%"
                theme="dark"
                extensions={[python()]}
                readOnly={isReadOnly}
                onChange={(value) => setPythonCode(value)}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
