<script>
import net from '@/modules/net'
import state from '@/modules/state'

export default {
  data () {
    return {
      username: '',
      password: '',
      state: state.state,
      error: ''
    }
  },
  methods: {
    async submit () {
      const res = await net.login(this.username, this.password)
      if (res.success) {
        this.username = ''
        this.password = ''
        this.error = ''
        console.log(net.isLoggedIn())
        this.$router.push('/main')
      } else {
        this.username = ''
        this.password = ''
        this.error = res.error
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
        :active="state.loading !== 0"
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
          v-model="username"
          type="text"
          placeholder="Username"
          required
        />
      </b-field>
      <b-field>
        <b-input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
      </b-field>
      <b-button
        expanded
        type="is-primary"
        @click="submit"
      >
        Login
      </b-button>
    </div>
  </div>
</template>

<style></style>
