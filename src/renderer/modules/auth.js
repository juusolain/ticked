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

  async sendKey () {
    var key = this.getKey()
    const code = crypto.randomBytes(6).toString('base64')
    const keyPassword = this.getPassword() + code
    const encryptedKey = aes256.encrypt(keyPassword, key)
    await net.sendKey(encryptedKey)
    return code
  }

  generateKey () {
    const key = crypto.randomBytes(256).toString('base64')
    this.setKey(key)
    console.log(key)
  }

  async fetchKey (code) {
    const newKey = await net.fetchKey()
    const keyPassword = this.getPassword() + code
    const decryptedKey = aes256.decrypt(keyPassword, newKey).toString('base64')
    this.setKey(decryptedKey)
    return decryptedKey
  }

  getKey () {
    return electronstore.get('key')
  }

  hasKey () {
    return electronstore.has('key')
  }

  setKey (newKey) {
    if (newKey) {
      return electronstore.set('key', newKey)
    } else {
      return electronstore.delete('key')
    }
  }
}

export default new Auth()
