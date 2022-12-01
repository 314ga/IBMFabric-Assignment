//Import Hyperledger Fabric 1.4 programming model - fabric-network
"use strict";

const {
  FileSystemWallet,
  Gateway,
  X509WalletMixin,
} = require("fabric-network");
const path = require("path");
const fs = require("fs");

//connect to the config file
const configPath = path.join(process.cwd(), "./config.json");
const configJSON = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
// let userName = config.userName;
let gatewayDiscovery = config.gatewayDiscovery;
let appAdmin = config.appAdmin;
let orgMSPID = config.orgMSPID;

// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

const util = require("util");

exports.connectToNetwork = async function (userName) {
  const gateway = new Gateway();

  try {
    const walletPath = path.join(process.cwd(), "../Org1Wallet");
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log("userName: ");
    console.log(userName);

    console.log("wallet: ");
    console.log(util.inspect(wallet));
    console.log("ccp: ");
    console.log(util.inspect(ccp));
    // userName = 'V123412';
    const userExists = await wallet.exists(userName);
    if (!userExists) {
      console.log(
        "An identity for the user " + userName + " does not exist in the wallet"
      );
      console.log("Run the registerUser.js application before retrying");
      let response = {};
      response.error =
        "An identity for the user " +
        userName +
        " does not exist in the wallet. Register " +
        userName +
        " first";
      return response;
    }

    console.log("before gateway.connect: ");

    await gateway.connect(ccp, {
      wallet,
      identity: userName,
      discovery: gatewayDiscovery,
    });

    // Connect to our local fabric
    const network = await gateway.getNetwork("mychannel");

    console.log("Connected to mychannel. ");
    // Get the contract we have installed on the peer
    const contract = await network.getContract("evotev2");

    let networkObj = {
      contract: contract,
      network: network,
      gateway: gateway,
    };

    return networkObj;
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  } finally {
    console.log("Done connecting to network.");
    // gateway.disconnect();
  }
};

exports.invoke = async function (networkObj, isQuery, func, args) {
  try {
    console.log("inside invoke");
    console.log(`isQuery: ${isQuery}, func: ${func}, args: ${args}`);
    console.log(util.inspect(networkObj));

    // console.log(util.inspect(JSON.parse(args[0])));

    if (isQuery === true) {
      console.log("inside isQuery");

      if (args) {
        console.log("inside isQuery, args");
        console.log(args);
        let response = await networkObj.contract.evaluateTransaction(
          func,
          args
        );
        console.log(response);
        console.log(`Transaction ${func} with args ${args} has been evaluated`);

        await networkObj.gateway.disconnect();

        return response;
      } else {
        let response = await networkObj.contract.evaluateTransaction(func);
        console.log(response);
        console.log(`Transaction ${func} without args has been evaluated`);

        await networkObj.gateway.disconnect();

        return response;
      }
    } else {
      console.log("notQuery");
      if (args) {
        console.log("notQuery, args");
        console.log("$$$$$$$$$$$$$ args: ");
        console.log(args);
        console.log(func);
        console.log(typeof args);

        args = JSON.parse(args[0]);

        console.log(util.inspect(args));
        args = JSON.stringify(args);
        console.log(util.inspect(args));

        console.log("before submit");
        // console.log(util.inspect(networkObj));
        let response = await networkObj.contract.submitTransaction(func, args);
        console.log("after submit");

        console.log(response);
        console.log(`Transaction ${func} with args ${args} has been submitted`);

        await networkObj.gateway.disconnect();

        return response;
      } else {
        let response = await networkObj.contract.submitTransaction(func);
        console.log(response);
        console.log(`Transaction ${func} with args has been submitted`);

        await networkObj.gateway.disconnect();

        return response;
      }
    }
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return error;
  }
};

exports.registerVoter = async function (
  voterId,
  registrarId,
  firstName,
  lastName
) {
  console.log("registrarId");
  console.log(registrarId);

  console.log("voterId ");
  console.log(voterId);

  if (!registrarId || !voterId || !firstName || !lastName) {
    let response = {};
    response.error =
      "Error! You need to fill all fields before you can register!";
    return response;
  }

  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "../Org1Wallet");
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log(wallet);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(voterId);
    if (userExists) {
      let response = {};
      console.log(
        `An identity for the user ${voterId} already exists in the wallet`
      );
      response.error = `Error! An identity for the user ${voterId} already exists in the wallet. Please enter
        a different license number.`;
      return response;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(appAdmin);
    if (!adminExists) {
      console.log(
        `An identity for the admin user ${appAdmin} does not exist in the wallet`
      );
      console.log("Run the enrollAdmin.js application before retrying");
      let response = {};
      response.error = `An identity for the admin user ${appAdmin} does not exist in the wallet. 
        Run the enrollAdmin.js application before retrying`;
      return response;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: appAdmin,
      discovery: gatewayDiscovery,
    });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    console.log("******************************************************");
    console.log(ca);
    const adminIdentity = gateway.getCurrentIdentity();
    console.log(`AdminIdentity: + ${adminIdentity}`);

    // Register the user, enroll the user, and import the new identity into the wallet.
    /* const secret = await ca.register(
      { affiliation: "", enrollmentID: voterId, role: "client" },
      adminIdentity
    );
    console.log(secret);
    const enrollment = await ca.enroll({
      enrollmentID: voterId,
      enrollmentSecret: secret,
    });*/
    const cert =
      "-----BEGIN CERTIFICATE-----\nMIIBzTCCAXSgAwIBAgIQaD+YILFstinYIQkGxPeouTAKBggqhkjOPQQDAjASMRAw\nDgYDVQQDEwdPcmcxIENBMB4XDTIyMTEzMDIyNDAyNloXDTMyMTEyNzIyNDAyNlow\nJTEOMAwGA1UECxMFYWRtaW4xEzARBgNVBAMTCk9yZzEgQWRtaW4wWTATBgcqhkjO\nPQIBBggqhkjOPQMBBwNCAAR3AFJ6dFP08etTQGKO+1M2/DfTK/hrhamxnDYAjpCM\nb363tLRPVPi1O4jRBsXcdqVG5xytIqcEh/9gMpb5G0bgo4GYMIGVMA4GA1UdDwEB\n/wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwEwDAYDVR0TAQH/\nBAIwADApBgNVHQ4EIgQgwdWh0dIAQTea4T9dyywVETXIo/9ZgKJ7uuY4uLL0nDUw\nKwYDVR0jBCQwIoAgYDlyLAzUyeYFk8gvpQnC4kAiZUBgxfRIa4EF8OlgKTUwCgYI\nKoZIzj0EAwIDRwAwRAIgMOwABkrjDuAgSk6gSLJ4cm7fWMIKtA9sha9MT7aOPigC\nIF9pQqoxjYZv6+8yqbZq8ixv9nsUaytCRhVnd/hwZZIM\n-----END CERTIFICATE-----\n";
    const key =
      "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg9rgHJyqWMpkLm4N9\nABEqN9ilHx4MviguSBmHYSwmxQGhRANCAAR3AFJ6dFP08etTQGKO+1M2/DfTK/hr\nhamxnDYAjpCMb363tLRPVPi1O4jRBsXcdqVG5xytIqcEh/9gMpb5G0bg\n-----END PRIVATE KEY-----\n";
    const userIdentity = await X509WalletMixin.createIdentity(
      orgMSPID,
      cert,
      key
    );
    await wallet.import(voterId, userIdentity);
    console.log(
      `Successfully registered voter ${firstName} ${lastName}. Use voterId ${voterId} to login above.`
    );
    let response = `Successfully registered voter ${firstName} ${lastName}. Use voterId ${voterId} to login above.`;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${voterId} + : ${error}`);
    let response = {};
    response.error = error;
    return response;
  }
};
