# Avalon Platform Proof of Concept

You will find in this repo all the code used to realize the [PoC](http://158.69.207.152:8765/).

## Features and design goals
- Demonstrate how decentralized applications (Ðapp) can be useful in achieving benefits.
- Best practices: Smart contracts are written with the latest best practices of Ethereum community
- Testable: We aim for 100% branch code coverage by automated test suite
- Auditable: Our tool chain supports verifiable EtherScan.io contract builds

## Description
This proof of concept prototype consists of 2 parts.
- A Server node.js: This server is centralized in this demonstration but nothing prevents the decentralized later with swarm or Whisper.
- A smart-contract deployed on the Rinkeby test network

Users are autonomous to interact with the smart-contract and subscribe to services that interest them.
The server can also query the smart-contract to verify the rights of the user.

## Security
Avalon is meant to provide secure, tested and community-audited code

If you find a security issue, please email [security@avalon.nu](mailto:security@avalon.nu).

## Contract source verified
[Proof of Concept](https://rinkeby.etherscan.io/address/0x76d177a05b4ddc8d398e09ecd4ea51527af7d1de#code) smart contract is available on Etherscan to be auditable.
