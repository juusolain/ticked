import { loadStripe } from '@stripe/stripe-js'

class Payments {
    init = async () => {
      this.stripe = await loadStripe('pk_test_9PEe48tGkcyxICp3juCtFr3M00fFSbjMnc')
    }

    goToCheckout = async token => {
      const { error } = await this.stripe.redirectToCheckout({
        sessionId: token
      })
      if (error) {
        throw error.message
      }
    }

    goToPortal = async url => {
      // this is dangerous - lets set to only allow stripe redirects
      window.location.replace(url)
    }
}

export default new Payments()
