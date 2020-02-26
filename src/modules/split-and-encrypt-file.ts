import CryptoJS from 'crypto-js'

type Base64String = string

const splitAndEcryptFile = function(file: Base64String) {
  const splittedPieces = file.match(/.{1,10485760}/g)
  // const encryptedPieces = splittedPieces.map(piece =>
  //   CryptoJS.AES.encrypt(piece, 'clowd836').toString(CryptoJS.enc.Base64)
  // )

  return splittedPieces
}

export default splitAndEcryptFile
