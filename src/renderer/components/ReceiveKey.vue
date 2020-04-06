<script>
import net from '@/modules/net'
import store from '@/modules/store'
import backend from '@/modules/backend'

export default {
  data () {
    return {
      code: '',
      store: store.state,
      error: ''
    }
  },
  methods: {
    async submit () {
      const returnError = await backend.fetchKey(this.code)
      this.code = ''
      if (returnError) {
        this.error = returnError
      }
    }
  }
}
</script>

<template>
  <div class="columns is-fullheight is-centered is-vcentered">
    <div
      class="is-login column is-half is-vcentered"
      @keyup.enter="submit"
    >
      <b-loading
        :active="store.loading !== 0"
        :is-full-page="true"
        :can-cancel="false"
      />
      <div
        v-if="error"
        class="error"
      >
        {{ error }}
      </div>
      <b-field>
        <b-input
          v-model="code"
          type="text"
          placeholder="Code"
          required
        />
      </b-field>
      <b-button
        expanded
        type="is-primary"
        @click="submit"
      >
        Receive key
      </b-button>
    </div>
  </div>
</template>

<style></style>
