// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, run, network } from 'hardhat';

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const SimpleStorageFC = await ethers.getContractFactory('SimpleStorage');
  console.log('Deploying contract ...');
  const contract = await SimpleStorageFC.deploy();

  await contract.deployed();

  console.log('Contract deployed to:', contract.address);

  // Check what Network we have
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await contract.deployTransaction.wait(6);
    // Verify our contract
    await verify(contract.address, []);
  }

  const currentVal = await contract.retrieve();
  console.log(`Current value: ${currentVal}`);

  const txResponse = await contract.store(32);
  await txResponse.wait(1);
  console.log(`Updated value to ${await contract.retrieve()}`);
}

async function verify(contractAdrress: string, args: []) {
  console.log('Verifying contract ...');
  try {
    await run('verify:verify', {
      address: contractAdrress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Already verified!');
    } else {
      console.log(e);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
    console.log('Successfully deployed');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
