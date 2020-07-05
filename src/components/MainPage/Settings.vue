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
    migrate (migMode) {
      backend.migrate(migMode)
    }
  }
}
</script>

<template>
  <div class="settings is-fullwidth">
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
    <section v-if="mode === 'online'">
      <p class="is-size-3">
        {{ $t('settings.migrate.title.import') }}
      </p>
      <div class="columns">
        <div class="column">
          <p>{{ $t('settings.migrate.info.import') }}</p>
          <b-button
            class="is-danger"
            @click="migrate('import')"
          >
            {{ $t('settings.migrate.button.import') }}
          </b-button>
        </div>
        <div class="column">
          <p>{{ $t('settings.migrate.info.export') }}</p>
          <b-button
            class="is-danger"
            @click="migrate('export')"
          >
            {{ $t('settings.migrate.button.export') }}
          </b-button>
        </div>
      </div>
    </section>
  </div>
</template>

<style></style>
