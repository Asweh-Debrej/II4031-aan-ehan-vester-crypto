const { SHA3 } = require('js-sha3');

export function hashMessage(message) {
    const hash = SHA3(256); // Create a SHA3-256 hash instance
    hash.update(message); // Update the hash with the message
    return hash.hex(); // Get the hexadecimal representation of the hash
}

// const message = 'Hello, world!';
// const hash = hashMessage(message);
// console.log(`SHA3-256 hash of "${message}" is: ${hash}`);
