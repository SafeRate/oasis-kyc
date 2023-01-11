import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";

import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
});

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  );
}
