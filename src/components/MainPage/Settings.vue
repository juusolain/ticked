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
  computed: {
    mode: store.getMode
  },
  methods: {
    deleteAccount (event) {
      backend.deleteAccount(this.password)
    },
    openPayments () {
      this.$router.push('/payments')
    },
    transfer () {
      backend.transfer()
    }
  }
}
</script>

<template>
  <div class="settings">
    <section>
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
    </section>
    <section>
      <b-button
        class="is-primary"
        @click="openPayments"
      >
        {{ $t('settings.payments') }}
      </b-button>
    </section>
    <section v-if="mode === 'local'">
      <b-button
        class="is-primary"
        @click="transfer"
      >
        {{ $t('settings.transfer') }}
      </b-button>
    </section>
  </div>
</template>

<style></style>
