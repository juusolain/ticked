<script>
import backend from '@/modules/backend'

export default {
  name: 'Payments',
  components: { },
  data () {
    return {
    }
  },
  methods: {
    openPortal () {
      backend.paymentPortal()
    },
    openCheckout () {
      backend.checkout()
    },
    back () {
      this.router.push('/main')
    }
  }
}
</script>

<template>
  <div class="columns is-fullheight is-centered is-vcentered">
    <div class="column">
      <b-button
        @click="openPortal()"
        label="Open portal"
      />
      <b-button
        @click="openCheckout()"
        label="New subscription"
      />
      <b-button
        @click="back()"
        label="Back"
      />
    </div>
  </div>
</template>

<style></style>
