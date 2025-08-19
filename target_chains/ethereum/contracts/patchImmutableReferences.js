// extractImmutable.js
import fs from 'fs';

const filePath = 'build/contracts/EntropyUpgradable.json';
const addressToVerify = process.argv[2];

if (!addressToVerify) {
  console.log("Current arguments:", process.argv);
  console.error("Usage: node extractImmutable.js <address-to-verify>");
  console.error("Example: node extractImmutable.js 0x26Eb7396e72b8903746b0133f7692dd1Fa86BC13");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Remove 0x prefix if present and ensure lowercase
const cleanAddress = addressToVerify.replace(/^0x/, '').toLowerCase();
// Pad to 64 characters (32 bytes) for immutable references
const paddedAddress = cleanAddress.padStart(64, '0');

const immutableReferences = data["immutableReferences"];
console.log(`Address to verify: ${addressToVerify} -> ${paddedAddress}`);

let bytecode = data["deployedBytecode"];

for (const [refName, refDetails] of Object.entries(immutableReferences)) {
    for (const ref of refDetails) {
        // Account for the "0x" prefix in the bytecode string
        const startPos = 2 + (ref.start * 2); // Convert byte position to hex string position (2 chars per byte)
        const length = ref.length * 2; // Convert byte length to hex string length
        
        console.log(`Replacing at position ${ref.start} (hex pos ${startPos}) with length ${ref.length} (hex length ${length})`);
        console.log(`Original bytecode length: ${bytecode.length}`);
        
        // Replace the bytes at the specified position with the lowercase address
        bytecode = bytecode.slice(0, startPos) + paddedAddress + bytecode.slice(startPos + length);
    }
    console.log(`  Updated bytecode after processing ${refName}`);
}

console.log('Final patched bytecode:', bytecode);
