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
      register_passwordVerify: '',
      register_email: '',
      store: store.state,
      mode: 'login',
      error: ''
    }
  },
  methods: {
    async login () {
      const returnError = await backend.login(this.login_user, this.login_password)
      this.login_user = ''
      this.login_password = ''
      if (returnError) {
        this.error = returnError
      }
    },
    async register () {

    },
    switchTo (newMode) {
      this.mode = newMode
    }
  }
}
</script>

<template>
  <div class="columns is-fullheight is-centered is-vcentered">
    <div
      class="is-login column is-half is-vcentered"
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
      <div
        v-if="mode === 'login'"
        @keyup.enter="login"
      >
        <b-field label="Username or email">
          <b-input
            v-model="login_user"
            type="text"
            placeholder="Username or email"
            required
          />
        </b-field>
        <b-field label="Password">
          <b-input
            v-model="login_password"
            type="password"
            placeholder="Password"
            password-reveal
            required
          />
        </b-field>
        <b-button
          expanded
          type="is-primary"
          @click="login"
        >
          Login
        </b-button>
        <a
          href="#"
          @click="switchTo('register')"
        >
          Create a new account
        </a>
      </div>
      <div
        v-if="mode === 'register'"
        @keyup.enter="register"
      >
        <b-field label="Username">
          <b-input
            v-model="register_username"
            type="text"
            placeholder="Username"
            required
          />
        </b-field>
        <b-field label="Password">
          <b-input
            v-model="register_password"
            type="password"
            placeholder="Password"
            password-reveal
            required
          />
        </b-field>
        <b-field label="Verify password">
          <b-input
            v-model="register_passwordVerify"
            type="password"
            placeholder="Password"
            required
          />
        </b-field>
        <b-button
          expanded
          type="is-primary"
          @click="login"
        >
          Register
        </b-button>
        <a
          href="#"
          @click="switchTo('login')"
        >
          Login instead
        </a>
      </div>
    </div>
  </div>
</template>

<style></style>
