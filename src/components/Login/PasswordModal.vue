<script>
import backend from '@/modules/backend'
import store from '@/modules/store'

export default {
  name: 'PasswordModal',
  data () {
    return {
      password: ''
    }
  },
  methods: {
    submit () {
      this.$emit('password', this.password)
      this.close()
    },
    close () {
      this.$parent.close()
    }
  }
}
</script>

<template>
  <div
    class="modal-card"
    style="width: auto"
  >
    <header class="modal-card-head">
      <p class="modal-card-title">
        {{ $t('local.login.title') }}
      </p>
    </header>
    <section class="modal-card-body">
      <b-field :label="$t('local.login.label')">
        <b-input
          v-model="password"
          type="text"
          required
        />
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button
        type="is-primary"
        @click="submit"
      >
        {{ $t('local.login.submit') }}
      </b-button>
    </footer>
  </div>
</template>

<style></style>
