## Lit - Livepeer Starter

This is a starter project for building a Livepeer powered video streaming application with token gated access using Lit.

## Getting Started

> Rename `.env.example` to `.env` and update the values accordingly.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##### Access Control conditions:

For the purpose of this demo, we are using a Color Token NFT as an access control condition. Your stream viewers are required to have a Color Token NFT(CLRT). If they dont have one, Ask them to mint one here: https://color-marketplace.vercel.app/

> You can use any access control conditions of Lit Protocol. For more info, visit: https://developer.litprotocol.com/coreConcepts/accessControl/intro

> I'm planning to add user defined access control conditions in the future.

```javascript
// Your stream viewers are required to have a Color Token NFT(CLRT)
const accessControlConditions = [
  {
    contractAddress: "0xB56946D84E4Dd277A8E575D5Dae551638010C6A8", // Color Token NFT address on Mumbai Testnet
    standardContractType: "ERC721",
    chain: "mumbai",
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0"
    }
  }
];
```

#### Demo

https://user-images.githubusercontent.com/29351207/208732278-4dafcbfb-0af5-485e-aa93-7c4e924e88a9.mp4

https://user-images.githubusercontent.com/29351207/208732296-480c992b-55d9-443a-9403-fcebdb3a7970.mp4
