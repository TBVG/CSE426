
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy StudyToEarnNFT
  const StudyToEarnNFT = await ethers.getContractFactory("StudyToEarnNFT");
  const studyToken = await StudyToEarnNFT.deploy();
  
  await studyToken.deployed();

  console.log("StudyToEarnNFT deployed to:", studyToken.address);

  // Save the contract address to a file for the frontend
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ StudyToEarnNFT: studyToken.address }, undefined, 2)
  );

  console.log("Contract address saved to src/contracts/contract-address.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
