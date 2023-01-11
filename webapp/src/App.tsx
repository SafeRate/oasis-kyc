import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import web3 from "web3";
import { abi, contractAddress } from "./constants";

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [address, setAddress] = React.useState(null);
  const [currentStep, setCurrentStep] = React.useState(0);

  useEffect(() => {
    const callAsync = async () => {
      const w3 = new web3();
      w3.setProvider(
        new web3.providers.HttpProvider("https://emerald.oasis.dev")
      );

      const contract = new w3.eth.Contract(abi as any, contractAddress);
      const test = await contract.methods
        .balanceOf("0x60d247965c29979664a00F09303a75f10eE7fCc8")
        .call();

      console.log("test", test);
    };
    callAsync();
  }, []);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      bg="gray.100"
    >
      <Card maxW="xl" bg="white">
        <CardHeader fontWeight={"bold"} fontSize="2xl">
          Get Started
        </CardHeader>
        <CardBody>
          {(() => {
            if (currentStep === 0) {
              return (
                <Box>
                  <Box>
                    Click next to create a wallet and receive a public address
                  </Box>
                </Box>
              );
            } else if (currentStep === 1) {
              return (
                <Box>
                  <Box>My Wallet Address: {address}</Box>
                  <Box>
                    1. <Button>Copy Address To Clipboard</Button>
                  </Box>
                  <Box>
                    2. Go to{" "}
                    <Button
                      variant="link"
                      onClick={() =>
                        window.open("https://identity.oasislabs.com/", "_blank")
                      }
                    >
                      Go to Oasis Identity Website and complete KYC
                    </Button>
                  </Box>
                </Box>
              );
            } else if (currentStep === 2) {
            } else if (currentStep === 3) {
            }
            return null;
          })()}
        </CardBody>
        <CardFooter>
          <ButtonGroup>
            <Button
              colorScheme={"blue"}
              isLoading={isLoading}
              onClick={async () => {
                if (currentStep === 0) {
                  setIsLoading(true);
                  const response = await fetch("http://localhost:8080/create", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });

                  console.log("response", response);
                  try {
                    const data = await response.json();
                    console.log("data", data);
                    setAddress(data.address);
                    setIsLoading(false);
                  } catch (error) {
                    console.log("error", error);
                  }
                }
                setCurrentStep(currentStep + 1);
              }}
            >
              Next
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </Flex>
  );
};

export default App;
