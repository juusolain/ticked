import crypto from 'crypto'
import net from '@/modules/net'
import ElectronStore from 'electron-store'
import aes256 from 'aes256'

const electronstore = new ElectronStore()

class Auth {
  constructor () {
    this.password = null
  }

  setPassword (newPassword) {
    this.password = newPassword
  }

  async sendKey () {
    var key = null // this.getKey()
    if (!key) {
      key = crypto.randomBytes(256).toString('base64')
      this.setKey(key)
    }
    var keyPassword = this.password += crypto.randomBytes(8).toString('base64')
    console.log(keyPassword)
    const encryptedKey = aes256.encrypt(keyPassword, key)
    await net.sendKey(encryptedKey)
  }

  async fetchKey () {
    const newKey = await net.fetchKey()
    this.setKey(newKey)
  }

  getKey () {
    return electronstore.get('key')
  }

  setKey (newKey) {
    return electronstore.set('key', newKey)
  }
}

export default new Auth()
