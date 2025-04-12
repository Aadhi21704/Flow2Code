import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactFlowProvider } from "reactflow"; // Import ReactFlowProvider
import { Workflow } from "./Workflow/Workflow";

function App() {
  return (
    <ChakraProvider>
      <ReactFlowProvider> {/* Wrap the Workflow component */}
        <div>
          <h1>NLP Pipeline</h1>
          <Workflow />
        </div>
      </ReactFlowProvider>
    </ChakraProvider>
  );
}

export default App;
