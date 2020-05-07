import net from '@/modules/net'
import store from '@/modules/store'

import ElectronStore from 'electron-store'
import aes256 from 'aes256'
import keytar from 'keytar'
import srp from 'secure-remote-password/client'
import crypto from 'crypto'
import util from 'util'

const pbkdf2 = util.promisify(crypto.pbkdf2)

class Auth {
  constructor () {
    this.clientEphemeral = null
    this.clientSession = null
  }

  setPassword = async newPassword => {
    return keytar.setPassword('ticked', net.getUserID(), newPassword)
  }

  getPassword = async () => {
    return keytar.getPassword('ticked', net.getUserID())
  }

  // Base decrypt
  decrypt = async data => {
    try {
      const decrypted = await aes256.decrypt(await this.getPassword(), data)
      return decrypted
    } catch (error) {
      console.warn(error)
      throw 'error.auth.decrypterror'
    }
  }

  createVerifier = async (username, password) => {
    const salt = srp.generateSalt()
    const privateKey = await this.getPrivateKey(username, password, salt)
    console.log(privateKey)
    const verifier = srp.deriveVerifier(privateKey)
    return {verifier, salt}
  }

  getPrivateKey = async (username, password, salt) => {
    const secret = `${username}:${password}`
    const keyBuf = await pbkdf2(secret, salt, 10000, 512, 'sha512')
    const privateKey = keyBuf.toString('hex')
    return privateKey
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
    try {
      const encrypted = await aes256.encrypt(await this.getPassword(), data)
      return encrypted
    } catch (error) {
      console.warn(error)
      throw 'error.auth.encrypterror'
    }
  }

  // Decrypt array with specified decryptor function
  decryptArray = async (dataArray, decryptor = this.decrypt) => {
    var decryptedArray = []
    for await (const element of dataArray) {
      const decrypted = await decryptor(element)
      decryptedArray.push(decrypted)
    }
    return decryptedArray
  }

  // Encrypt array with specified encryptor function
  encryptArray = async (dataArray, encryptor = this.decrypt) => {
    var encryptedArray = []
    for await (const element of dataArray) {
      const decrypted = await encryptor(element)
      encryptedArray.push(decrypted)
    }
    return encryptedArray
  }

  decryptObj = async obj => {
    var newObj = {
      listid: obj.listid,
      userid: obj.userid
    }
    if (obj.taskid) {
      newObj.taskid = obj.taskid
    }
    for (const [prop, value] of Object.entries(obj)) {
      if (!['taskid', 'listid', 'userid'].includes(prop)) {
        if (value) {
          newObj[prop] = await this.decrypt(value)
        } else {
          newObj[prop] = null
        }
      }
    }
    console.log('Decrypted: ', newObj)
    return newObj
  }

  encryptObj = async obj => {
    var newObj = {
      listid: obj.listid,
      userid: obj.userid
    }
    if (obj.taskid) {
      newObj.taskid = obj.taskid
    }
    for (const [prop, value] of Object.entries(obj)) {
      if (!['taskid', 'listid', 'userid'].includes(prop)) {
        if (value) {
          newObj[prop] = await this.encrypt(value)
        } else {
          newObj[prop] = null
        }
      }
    }
    console.log('Encrypted: ', newObj)
    return newObj
  }
}

export default new Auth()
