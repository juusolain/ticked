import net from '@/modules/net'
import store from '@/modules/store'

import ElectronStore from 'electron-store'
import aes256 from 'aes256'
import keytar from 'keytar'
import srp from 'secure-remote-password/client'
import crypto from 'crypto'
import util from 'util'
import { get } from 'http'

const pbkdf2 = util.promisify(crypto.pbkdf2)

class Auth {
  constructor () {
    this.clientEphemeral = null
    this.clientSession = null
  }

  createEncryptionKey = async () => {
    try {
      const buf = await getRandomBytes(128) // Get random bytes for key... 128 bytes might be a bit overkill, but better safe than sorry
      const key = buf.toString('base64')
      return keytar.setPassword('ticked', net.getUserID(), key)
    } catch (error) {
      console.error(error)
      throw 'error.auth.datakey.create'
    }
  }

  getEncryptionKey = async () => {
    return keytar.getPassword('ticked', net.getUserID())
  }

  getEncryptionKeyWithPass = async pass => {
    try {
      const decrypted = await this.getEncryptionKey()
      const encrypted = await aes256.encrypt(pass, decrypted)
      return encrypted
    } catch (error) {
      console.error(error)
      throw 'error.auth.datakey'
    }
  }

  setEncryptionKeyWithPass = async (pass, encrypted) => {
    try {
      const key = await aes256.decrypt(pass, encrypted)
      await keytar.setPassword('ticked', net.getUserID(), key)
    } catch (error) {
      console.error(error)
      throw 'error.auth.datakey'
    }
  }

  createVerifier = async (username, password) => {
    try {
      const salt = srp.generateSalt()
      const privateKey = await this.getPrivateKey(username, password, salt)
      const verifier = srp.deriveVerifier(privateKey)
      return {verifier, salt}
    } catch (error) {
      console.error(error)
      throw 'error.auth.createVerifier'
    }
  }

  getPrivateKey = async (username, password, salt) => {
    try {
      const secret = `${username}:${password}`
      const keyBuf = await pbkdf2(secret, salt, 10000, 512, 'sha512')
      const privateKey = keyBuf.toString('hex')
      return privateKey
    } catch (error) {
      console.error(error)
      throw 'error.auth.privateKey'
    }
  }

  createEphemeral = async () => {
    this.clientEphemeral = srp.generateEphemeral()
    return this.clientEphemeral.public
  }

  createSession = async (username, password, salt, serverEphemeralPublic) => {
    console.log({username, password, salt, serverEphemeralPublic})
    const privateKey = await this.getPrivateKey(username, password, salt)
    console.log(privateKey)
    this.clientSession = await srp.deriveSession(this.clientEphemeral.secret, serverEphemeralPublic, salt, username, privateKey)
    return this.clientSession.proof
  }

  // Base encrypt
  encrypt = async data => {
    data = JSON.stringify(data)
    try {
      const encrypted = await aes256.encrypt(await this.getEncryptionKey(), data)
      return encrypted
    } catch (error) {
      console.warn(error)
      throw 'error.auth.encrypterror'
    }
  }

    // Base decrypt
    decrypt = async data => {
      try {
        const decrypted = await aes256.decrypt(await this.getEncryptionKey(), data)
        try {
          return JSON.parse(decrypted)
        } catch (error) {
          try {
            return JSON.parse(data)
          } catch (error) {
            return data
          }
        }
      } catch (error) {
        console.warn(error)
        throw 'error.auth.decrypterror'
      }
    }

  // Decrypt array with specified decryptor function
  decryptArray = async (dataArray, decryptor = this.decrypt) => {
    var decryptedArray = []
    if (dataArray) {
      for await (const element of dataArray) {
        const decrypted = await decryptor(element)
        decryptedArray.push(decrypted)
      }
    }
    return decryptedArray
  }

  // Encrypt array with specified encryptor function
  encryptArray = async (dataArray, encryptor = this.decrypt) => {
    var encryptedArray = []
    if (dataArray) {
      for await (const element of dataArray) {
        const decrypted = await encryptor(element)
        encryptedArray.push(decrypted)
      }
    }
    return encryptedArray
  }

  decryptObj = async obj => {
    var newObj = {}
    if (!obj) {
      throw 'error.auth.decrypterror'
    }
    for (const [prop, value] of Object.entries(obj)) {
      if (!['taskid', 'listid', 'userid', 'deleted', 'modified'].includes(prop)) {
        if (value) {
          newObj[prop] = await this.decrypt(value)
        } else {
          newObj[prop] = null
        }
      } else {
        newObj[prop] = value
      }
    }
    console.log('Decrypted: ', newObj)
    return newObj
  }

  encryptObj = async obj => {
    var newObj = {}
    if (!obj) {
      throw 'error.auth.encrypterror'
    }
    for (const [prop, value] of Object.entries(obj)) {
      if (!['taskid', 'listid', 'userid', 'deleted', 'modified'].includes(prop)) {
        if (value) {
          newObj[prop] = await this.encrypt(value)
        } else {
          newObj[prop] = null
        }
      } else {
        newObj[prop] = value
      }
    }
    console.log('Encrypted: ', newObj)
    return newObj
  }
}

function getRandomBytes (bytes = 128) { // returns promise
  return new Promise((resolve, reject) => {
    crypto.randomBytes(bytes, function (err, buffer) {
      if (err) {
        reject(err)
      }
      resolve(buffer)
    })
  })
}

export default new Auth()
