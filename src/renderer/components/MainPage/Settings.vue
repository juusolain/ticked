<script>
import net from '@/modules/net'
import store from '@/modules/store'
import backend from '@/modules/backend'

export default {
  name: 'Settings',
  data () {
    return {
      store: store.state,
      password: ''
    }
  },
  methods: {
    deleteAccount (event) {
      backend.deleteAccount(this.password)
    }
  }
}
</script>

<template>
  <div class="settings">
    <b-field :label="$t('settings.delete.label.password')">
      <b-input
        v-model="password"
        type="password"
        :placeholder="$t('settings.delete.placeholder.password')"
        password-reveal
        required
      />
    </b-field>
    <b-button
      class="is-danger"
      @click="deleteAccount"
    >
      {{ $t('settings.delete.label.delete') }}
    </b-button>
  </div>
</template>

<style></style>
