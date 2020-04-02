import crypto from 'crypto'
import net from '@/modules/net'

class auth {
  constructor () {
    this.ourDH = null
    this.ourKey = null
    this.prime = null
  }

  sendKey () {
    this.ourDH = crypto.createDiffieHellman(2048)
    this.ourKey = this.ourDH.generateKeys('base64')
    this.prime = this.ourDH.getPrime('base64')
    net.sendKey(this.ourKey, this.prime)
  }
}
