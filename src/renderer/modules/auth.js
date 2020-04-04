import crypto from 'crypto'
import net from '@/modules/net'
import ElectronStore from 'electron-store'

const electronstore = new ElectronStore()

class auth {
  constructor () {
    this.password = null
  }

  setPassword (newPassword) {
    this.password = newPassword
  }

  async sendKey () {
    var key = this.getKey()
    if (!key) {
      key = crypto.randomBytes(256).toString('base64')
      this.setKey(key)
    }
    var keyPassword = this.password += crypto.randomBytes(8).toString('base64')
    const cipher = crypto.createCipheriv('aes256', keyPassword, null)
    var encryptedKey = cipher.update(key)
    encryptedKey += cipher.final()
    console.log(encryptedKey)
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
