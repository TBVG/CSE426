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
   - If you see any errors, try running `npm install` again

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

6. **Access the application**
   - Open your browser and go to `http://localhost:5173`
   - Connect your MetaMask wallet:
     1. Click the MetaMask extension
     2. Click "Add Network"
     3. Add the following details:
        - Network Name: Hardhat Local
        - RPC URL: http://127.0.0.1:8545
        - Chain ID: 1337
        - Currency Symbol: ETH
   - Import a test account:
     1. In MetaMask, click the account icon
     2. Click "Import Account"
     3. Paste one of the private keys from the Hardhat node terminal

## Verifying Everything Works

1. The Hardhat node terminal should show "Started HTTP and WebSocket JSON-RPC server"
2. The contract deployment should show a success message with an address
3. The development server should show "Local: http://localhost:5173"
4. The website should load in your browser
5. MetaMask should connect to the Hardhat network
6. You should see your test account balance in MetaMask

## Important Notes

- The application uses Vite as the build tool
- Smart contracts are deployed on a local Hardhat network
- Make sure to import a test account from Hardhat into MetaMask (private keys will be shown in the Hardhat node terminal)
- The application uses TypeScript and React for the frontend
- Tailwind CSS is used for styling

## Troubleshooting

If you encounter any issues:
1. Make sure all three terminal windows are running:
   - Hardhat node
   - Contract deployment
   - Development server
2. Check that MetaMask is connected to the correct network (Hardhat Local)
3. Verify your test account has ETH (should show 10000 ETH)
4. If the website doesn't load, try:
   - Clearing your browser cache
   - Using a different browser
   - Checking the browser console for errors
5. If you see "Module not found" errors:
   - Delete the `node_modules` folder
   - Run `npm install` again
