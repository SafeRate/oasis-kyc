import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import web3 from "web3";
import { abi, contractAddress } from "./constants";

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [address, setAddress] = React.useState(null);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isVerifyingKycToken, setIsVerifyingKycToken] = React.useState(false);
  const [isTokenVerified, setIsTokenVerified] = React.useState(false);

  useEffect(() => {
    if (!isVerifyingKycToken) return;
    const callAsync = async () => {
      const w3 = new web3();
      w3.setProvider(
        new web3.providers.HttpProvider("https://emerald.oasis.dev")
      );

      const contract = new w3.eth.Contract(abi as any, contractAddress);
      try {
        console.log("address", address);
        const isTokenVerified = await contract.methods
          .balanceOf(address)
          .call();

        console.log("isTokenVerified", isTokenVerified);
        console.log("typeof isTokenVerified", typeof isTokenVerified);

        setIsTokenVerified(Boolean(Number(isTokenVerified)));
      } catch (error) {}

      setIsVerifyingKycToken(false);
    };
    callAsync();
  }, [isVerifyingKycToken]);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      bg="gray.100"
    >
      <Card maxW="xl" bg="white">
        <CardHeader fontWeight={"bold"} fontSize="2xl">
          Oasis KYC
        </CardHeader>
        <Divider />
        <CardBody>
          {(() => {
            if (currentStep === 0) {
              return (
                <Box>
                  <Box fontWeight={"bold"} fontSize="xl" mb="2">
                    Welcome!
                  </Box>
                  <Box>
                    Click next to create a new wallet and store the wallet
                    details in Oasis Parcel
                  </Box>
                </Box>
              );
            } else if (currentStep === 1 && address) {
              return (
                <Stack spacing={"4"}>
                  <Box fontWeight={"bold"} fontSize="xl" mb="2">
                    You created a wallet!
                  </Box>
                  <Box>My Wallet Address: {address}</Box>
                  <Box>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(address);
                      }}
                    >
                      Copy Address To Clipboard
                    </Button>
                  </Box>
                  <Box>
                    <Box></Box>
                    <Button
                      colorScheme={"blue"}
                      variant="link"
                      onClick={() =>
                        window.open("https://identity.oasislabs.com/", "_blank")
                      }
                    >
                      Go to Oasis Identity Website to complete additional KYC
                      Steps
                    </Button>
                  </Box>
                </Stack>
              );
            } else if (currentStep === 2) {
              return (
                <Box>
                  <Box fontWeight={"bold"} fontSize="xl" mb="2">
                    {(() => {
                      if (isVerifyingKycToken) {
                        return (
                          <>
                            Verifying KYC Token... <Spinner />
                          </>
                        );
                      } else if (isTokenVerified) {
                        return "KYC Process is Complete!";
                      } else {
                        return "KYC Process is Incomplete!";
                      }
                    })()}
                  </Box>
                </Box>
              );
            }
            return null;
          })()}
        </CardBody>
        <Divider />
        <CardFooter justifyContent={"flex-end"}>
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
                } else if (currentStep === 1) {
                  setIsVerifyingKycToken(true);
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
