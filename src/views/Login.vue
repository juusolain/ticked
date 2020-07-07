<script>
import net from '@/modules/net'
import store from '@/modules/store'
import backend from '@/modules/backend'

export default {
  data () {
    return {
      login_user: '',
      login_password: '',
      register_username: '',
      register_password: '',
      register_email: '',
      store: store.state,
      mode: 'login',
      error: ''
    }
  },
  methods: {
    async login () {
      this.error = ''
      try {
        const returnError = await backend.login({
          username: this.login_user,
          password: this.login_password
        })
      } catch (error) {
        this.error = error
      }
      this.clearForms()
    },
    async register () {
      this.error = ''
      try {
        await backend.register({
          password: this.register_password,
          email: this.register_email,
          username: this.register_username
        })
      } catch (error) {
        this.error = error
      }
      this.clearForms()
    },
    switchTo (newMode) {
      this.mode = newMode
      this.error = null
      this.clearForms()
    },
    clearForms () {
      this.register_email = ''
      this.register_password = ''
      this.register_username = ''
      this.login_user = ''
      this.login_password = ''
    },
    modeSelect () {
      this.$router.push('/modeSelect')
    }
  }
}
</script>

<template>
  <div class="columns is-fullheight is-centered is-vcentered">
    <a
      class="login link modeselect"
      @click="modeSelect"
    >
      {{ $t('login.link.modeselect') }}
    </a>
    <div
      class="is-login column is-half is-vcentered"
    >
      <b-loading
        :active="store.loading !== 0"
        :is-full-page="true"
        :can-cancel="false"
      />
      <b-notification
        v-if="error"
        type="is-danger"
      >
        {{ $t(error) }}
      </b-notification>
      <div
        v-if="mode === 'login'"
        @keyup.enter="login"
      >
        <b-field :label="$t('login.label.user')">
          <b-input
            v-model="login_user"
            type="text"
            :placeholder="$t('login.placeholder.user')"
            required
          />
        </b-field>
        <b-field :label="$t('login.label.password')">
          <b-input
            v-model="login_password"
            type="password"
            :placeholder="$t('login.placeholder.password')"
            password-reveal
            required
          />
        </b-field>
        <b-button
          expanded
          type="is-primary"
          @click="login"
        >
          {{ $t('login.label.login') }}
        </b-button>
        <a
          @click="switchTo('register')"
        >
          {{ $t('login.link.register') }}
        </a>
      </div>
      <div
        v-if="mode === 'register'"
        @keyup.enter="register"
      >
        <b-field :label="$t('register.label.username')">
          <b-input
            v-model="register_username"
            type="text"
            :placeholder="$t('register.placeholder.username')"
            required
          />
        </b-field>
        <b-field :label="$t('register.label.password')">
          <b-input
            v-model="register_password"
            type="password"
            :placeholder="$t('register.placeholder.password')"
            password-reveal
            required
          />
        </b-field>
        <b-button
          expanded
          type="is-primary"
          @click="register"
        >
          {{ $t('register.label.register') }}
        </b-button>
        <a
          @click="switchTo('login')"
        >
          {{ $t('register.link.login') }}
        </a>
      </div>
    </div>
  </div>
</template>

<style></style>
