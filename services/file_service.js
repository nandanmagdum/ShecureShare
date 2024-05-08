const crypto = require("crypto");
const fs = require("fs");
require("dotenv").config();
console.log(process.env.FILE_KEY);

const algorithm = 'aes-256-ctr';
let key = process.env.FILE_KEY ;
key = crypto.createHash("sha256").update(String(key)).digest('base64').substring(0, 32);

const encrypt = (buffer) => {
    const iv = crypto.randomBytes(16);
    const chipher = crypto.createCipheriv(algorithm, key, iv);
    const result = Buffer.concat([iv, chipher.update(buffer), chipher.final()]);
    return result;
}

const decrypt = (encrypted) => {
    console.log(typeof encrypted);
    const iv = encrypted.slice(0,16);
    encrypted = encrypted.slice(16);
    const dechipher = crypto.createDecipheriv(algorithm, key, iv);
    const result = Buffer.concat([dechipher.update(encrypted), dechipher.final()]);
    return result;
} 

module.exports = {
    encrypt,
    decrypt
}