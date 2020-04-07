import net from '@/modules/net'
import store from '@/modules/store'

import ElectronStore from 'electron-store'
import aes256 from 'aes256'
import keytar from 'keytar'

class Auth {
  setPassword = async newPassword => {
    return keytar.setPassword('ticked', net.getUserID(), newPassword)
  }

  getPassword = async () => {
    return keytar.getPassword('ticked', net.getUserID())
  }

  // Base decrypt
  decrypt = async data => {
    const decrypted = await aes256.decrypt(await this.getPassword(), data)
    return decrypted
  }

  // Base encrypt
  encrypt = async data => {
    const encrypted = await aes256.encrypt(await this.getPassword(), data)
    return encrypted
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
