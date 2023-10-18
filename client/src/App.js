import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import { useEffect, useState } from "react";
import "./App.css";
import contract from "./contracts/NFTCollection.json";
import AdoptionContract from "./contracts/Adoption.json"; // Replace with your contract's JSON

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import listBadges from "./pets.json";
import { Container } from "@mui/material";
import TruffleContract from "truffle-contract"

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [adopted, setAdopted] = useState("");
  const [pets, setPets] = useState([]);
  const [adopters, setAdopters] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [adContract, setContract] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Get network provider and web3 instance.
        const web3 = await new Web3(
          Web3.givenProvider || "http://localhost:7545"
        );

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        console.log("Network: ", await web3.eth.net.getId());
        const contractAddress =
          contract.networks[await web3.eth.net.getId()].address;
        const abi = contract.abi;

        // Create a contract instance
        const nftContract = new web3.eth.Contract(abi, contractAddress);
        console.log(nftContract);
        console.log("Initialize payment");

        let nftTxn = await nftContract.methods
          .mintNFTs(1)
          .send({
            from: accounts[0],
            value: web3.utils.toWei("0.0001", "ether"),
          })
          .on("receipt", function () {
            console.log("receipt");
          });

        console.log("Mining...please wait");
        console.log("Mined: ", nftTxn.transactionHash);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        variant="contained"
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const mintNftButton = () => {
    return (
      <div>
        <Button
          variant="contained"
          onClick={mintNftHandler}
          className="cta-button mint-nft-button"
        >
          Mint NFT
        </Button>
      </div>
    );
  };

  const initWeb3 = async () => {
    let web3Provider;
  };

  useEffect(() => {
    checkWalletIsConnected();
    const initApp = async () => {
      try {
        const web3 = await new Web3(
          Web3.givenProvider || "http://localhost:7545"
        );
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AdoptionContract.networks[networkId];
        const adcontractAddress =
          AdoptionContract.networks[await web3.eth.net.getId()].address;
        let contract = new web3.eth.Contract(
          AdoptionContract.abi,
          adcontractAddress
        );

        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        setPets(listBadges);
      
        await markAdopted();
        console.log(adopters);
      } catch (error) {
        console.error("Error loading web3, accounts, or contract:", error);
      }
    };

    initApp();
  }, []);

  // const markAdopted = () => {
  //   adContract.methods
  //     .getAdopters()
  //     .call()
  //     .then((adopters) => {
  //       setAdopters(adopters);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  const markAdopted = async () => {
    console.log("updated adopter");
    // if (adContract) {
    //   await adContract.methods
    //     .getAdopters()
    //     .call()
    //     .then((adopters) => {
    //       console.log(adopters);
    //       const updatedPets = pets.map((pet, index) => {
    //         return {
    //           ...pet,
    //           isAdopted:
    //             adopters[index] !==
    //             "0x0000000000000000000000000000000000000000",
    //         };
    //       });
    //       setPets(updatedPets);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // }
    if (adContract) {
      const adopters = await adContract.methods.getAdopters().call();
      console.log(adopters);
      setAdopters(adopters);
    }
  };

  const handleAdopt = async (petId) => {
    // const { adContract, adopters } = this.state;

    console.log(adContract);
    console.log(petId);
    console.log(accounts[0]);

    await adContract.methods.adopt(petId).send({ from: accounts[0] });
    markAdopted();
    // .on("receipt", () => {
    //   markAdopted();
    //   console.log("updated adopter");

    //   adContract.methods
    //     .getAdopters()
    //     .call()
    //     .then((adopters) => {
    //       console.log(adopters);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // })
    // .on("error", (error) => {
    //   console.error(error);
    // });
  };

  return (
    <div className="App">
      <Container className="main-app">
        <Grid container spacing={2}>
          {listBadges.map((data, index) => {
            return (
              <Grid item xs={4}>
                <Card id={data.id} sx={{ minWidth: 275, minHeight: 400 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {data.name}
                    </Typography>
                    <Typography variant="h5" component="div">
                      <img src={data.picture} loading="lazy" />
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {data.category}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {data.code}
                    </Typography>
                    <Typography variant="body2">{data.description}</Typography>
                  </CardContent>
                  <Box
                    textAlign="center"
                    style={{ textAlign: "center", marginBottom: "1em" }}
                  >
                    <Button
                      disabled={data.claimed}
                      variant="contained"
                      size="small"
                      onClick={() => handleAdopt(index)}
                    >
                      Claim
                    </Button>
                    {/* {adopters[index] !==
                    "0x0000000000000000000000000000000000000000" ? (
                      <p>Claimed</p>
                    ) : (
                      <Button onClick={() => handleAdopt(index)}>Adopt</Button>
                    )} */}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </Container>
    </div>
  );
}

export default App;
