<script>
import { Card, createToken } from 'vue-stripe-elements-plus'

export default {
  name: 'Payments',
  components: { Card },
  props: {
    stripeOptions: {
      type: Object,
      default: function () {
        return {}
      }
    },
    stripeKey: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      complete: false
    }
  },
  methods: {
    async pay () {
      const data = await createToken()
      console.log(data)
    }
  }
}
</script>

<template>
  <div id="pay">
    <h1>Please give us your payment details:</h1>
    <card
      class="stripe-card"
      :class="{ complete }"
      :stripe="stripeKey"
      :options="stripeOptions"
      @change="complete = $event.complete"
    />
    <button
      class="pay-with-stripe"
      :disabled="!complete"
      @click="pay"
    >
      Pay with credit card
    </button>
  </div>
</template>

<style>
.stripe-card {
  width: 300px;
  border: 1px solid grey;
}
.stripe-card.complete {
  border-color: green;
}
</style>
