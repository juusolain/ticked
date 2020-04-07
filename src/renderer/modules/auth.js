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
    const decrypted = aes256.decrypt(this.getPassword(), data)
    return decrypted
  }

  encrypt (data) {
    const encrypted = aes256.encrypt(this.getPassword(), data)
    return encrypted
  }
}

export default new Auth()
