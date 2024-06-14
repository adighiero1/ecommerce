const crypto = require('crypto');

/**
 * Generates a random token string
 * @param {number} length - The length of the token
 * @returns {string} - The generated token
 */
function tokenGenerator(length) {
    return crypto.randomBytes(length).toString('hex');
}

module.exports = tokenGenerator;