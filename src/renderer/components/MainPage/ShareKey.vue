<script>
import net from '@/modules/net'
import store from '@/modules/store'
import backend from '@/modules/backend'

export default {
  name: 'Tasklist',
  data () {
    return {
      error: null,
      code: null
    }
  },
  methods: {
    async getKey () {
      const code = await backend.sendKey()
      this.code = code
    }
  }
}
</script>

<template>
  <div class="shareKey">
    <p v-if="code">
      Code: {{ code }}
    </p>
    <button @click="getKey()">
      Share key
    </button>
  </div>
</template>

<style>

</style>
