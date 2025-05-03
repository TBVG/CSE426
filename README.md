# Learn & Earn NFT DApp

A blockchain-based learning platform where users can earn and level up NFTs by tracking their study progress.

## System Requirements

- Windows 10/11, macOS, or Linux
- Node.js version 16.x or higher
- NPM version 7.x or higher
- At least 4GB of RAM
- MetaMask browser extension (Chrome, Firefox, or Brave)

## Prerequisites

1. **Install Node.js and NPM**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation by running:
     ```sh
     node --version
     npm --version
     ```

2. **Install MetaMask**
   - Add the [MetaMask extension](https://metamask.io/download/) to your browser
   - Create a new wallet or import an existing one

## Steps to Run the Application

1. **Navigate to the project directory**
   ```sh
   cd learn-earn-nft-dapp-main
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```
   - Wait for all packages to install (this may take a few minutes)

3. **Start the local blockchain**
   ```sh
   npx hardhat node
   ```
   - Keep this terminal window open
   - You should see a list of test accounts and their private keys
   - Note down one of the private keys for MetaMask

4. **Deploy smart contracts** (in a new terminal window)
   ```sh
   npx hardhat run scripts/deploy.js --network localhost
   ```
   - Wait for the deployment to complete
   - You should see a message with the contract address

5. **Start the development server** (in a new terminal window)
   ```sh
   npm run dev
   ```
   - Wait for the server to start
   - You should see a message with the local URL

