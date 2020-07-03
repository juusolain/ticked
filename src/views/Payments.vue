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
      this.$router.push('/main')
    }
  }
}
</script>

<template>
  <div class="tile is-ancestor main-content">
    <div class="tile is-parent is-vertical">
      <article
        class="tile is-child is-info box notification"
        @click="openPortal()"
      >
        <p class="title">
          {{ $t('payments.portal') }}
        </p>
      </article>
      <article
        class="tile is-child notification box is-danger"
        @click="back()"
      >
        <p class="title">
          {{ $t('payments.back') }}
        </p>
      </article>
    </div>
    <div class="tile is-parent">
      <article
        class="tile is-child is-success box notification"
        @click="openCheckout()"
      >
        <p class="title">
          {{ $t('payments.checkout') }}
        </p>
      </article>
    </div>
  </div>
</template>

<style></style>
