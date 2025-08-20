# Pyth Entropy Source Code Verification
The purpose of this repo is to locally generate contract creation and deployedBytecode for the UpgradableEntropy contract such that it can be compared against the same bytecode that can be found at the deployed contract address as presented by the block explorer, Basescan.

The UpgradableEntropy implementation contract is deployed at `0xfc98d09b1c2e6a20ad17f442ee63cba20028ee50` which can be viewed (here)[https://basescan.org/address/0xfc98d09b1c2e6a20ad17f442ee63cba20028ee50#code].

## Verifying Source Code
In order to verify the source code we will locally generate two forms of bytecode that can be compared to the matching bytecode on Basescan. 

### Contract Creation Code
The first form of bytecode is the Contract Creation code. The contract creation code contains any initialization parameters, the runtime code for the contract (also known as deployed bytecode), and some assorted metadata that defines what code was compiled and what tools were used to compile it

### Deployed Bytecode
The deployed bytecode for the contract is the same as the runtime code seen in the Contract Creation code however it can have some small differences. The most relevant difference for this codebase is that the deployed bytecode has immutable variables patched into the runtime code upon deploy. In the contract creation code there will be regions of code that contain a string of 0s. These regions are marking out space in the runtime code where these immutable variables will be inserted upon deployment.

### Matching the Bytecode(s)
Matching the Contract Creation code is easy, we can simply directly pull the `bytecode` artifact from our build file (can be found in `target_chains/ethereum/contracts/build/contracts/UpgradableEntropy.json`). The deployed bytecode is a little more involved since we need to patch in these immutable variables. In our case, the immutable variables define the address of the contract itself thus we need to fill in the regions of zeros with the address of our contract padded to 32 bytes (addresses are 20 bytes and the Ethereum Virtual Machine stores data in chunks of 32 bytes). In order to do this we created a script called `patchImmutableReferences.js` which takes the address and name of the contract you are looking to verify and patches in the address to the correct areas based on the immutable references defined during compilation.

## Running the code
1. Install NVM to manage your node version (if not already installed)
2. Run `nvm use 22` to set to the correct version
3. Install `pnpm`, match the version to the version specified in `package.json` (v10.7.0); you can experiment with corepack to manage your pnpm version for you.
4. Navigate to the contracts directory: `cd target_chains/ethereum/contracts`
5. Run `pnpm i` to install packages
5. Run `pnpm turbo build --filter @pythnetwork/pyth-evm-contract` to install some other dependencies
6. Run `npm run gli-verify <contract_address>` in our case this will be `npm run gli-verify 0xfc98d09b1c2e6a20ad17f442ee63cba20028ee50` (Note: this is slightly different from the Megapot verification script because this repo uses a different package to manage compilation)
7. This will output the Contract Creation code, followed by the deployedBytecode
8. These outputs can then be compared against the same fields that can be found at the bottom of this webpage: https://basescan.org/address/0xfc98d09b1c2e6a20ad17f442ee63cba20028ee50#code

## Reference
While you will want to validate the bytecodes yourself I will include them below for reference as well:

Contract Creation Code: