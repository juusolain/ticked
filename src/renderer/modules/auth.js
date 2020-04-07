import crypto from 'crypto'
import net from '@/modules/net'
import store from '@/modules/store'

import ElectronStore from 'electron-store'
import aes256 from 'aes256'
import keytar from 'keytar'

const electronstore = new ElectronStore()

class Auth {
  setPassword (newPassword) {
    keytar.setPassword('ticked', net.getUserID(), newPassword)
  }

  getPassword () {
    keytar.getPassword('ticked', net.getUserID())
  }

  decrypt (data) {
    const decrypted = aes256.decrypt(this.getPassword(), JSON.stringify(data))
    console.log(JSON.parse(decrypted))
    return JSON.parse(decrypted)
  }

  encrypt (data) {
    const encrypted = aes256.encrypt(this.getPassword(), JSON.stringify(data))
    console.log(JSON.parse(encrypted))
    return JSON.parse(encrypted)
  }

  decryptArray (dataArray) {
    var decryptedArray = []
    dataArray.forEach(element => {
      const decrypted = this.decrypt(element)
      decryptedArray.push(decrypted)
    })
    return decryptedArray
  }
}

export default new Auth()
