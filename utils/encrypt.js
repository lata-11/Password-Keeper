import crypto from "crypto"
import decryptMessage from "./decrypt.js";
import deriveKey from "./deriveKey.js";
export default async function encryptMessage(message, givenString) {
  const salt = crypto.randomBytes(16); 
  const key = await deriveKey(givenString, salt); 

  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    ciphertext: encrypted,
    salt: salt.toString('hex'),
    iv: iv.toString('hex')
  };
}




// const givenString = 'encryption key';
// const message = 'This is a secret message.';


// encryptMessage(message, givenString)
//   .then(result => {
//     console.log('Ciphertext:', result.ciphertext);
//     console.log('Salt:', result.salt);
//     console.log('IV:', result.iv);

    
//     return decryptMessage(result.ciphertext, givenString, result.salt, result.iv);
//   })
//   .then(decryptedMessage => {
//     console.log('Decrypted Message:', decryptedMessage);
//   })
//   .catch(error => {
//     console.error('An error occurred:', error);
//   });
