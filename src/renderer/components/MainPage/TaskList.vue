<template>
	<div v-if="tasks">
		<Task v-for="task in tasks" :key="task.taskid" v-bind:task="task"></Task>
	</div>
</template>

<script>
import Task from './Task'
import axios from 'axios'

export default {
  name: 'tasklist',
  components: { Task },
  props: ['tasks'],
  methods: {
    async fetchData () {
      this.error = this.post = null
      this.loading = true
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        /*if(this.isLoggedIn()){
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }*/
        const res = await axios({
          baseURL: this.server,
          method: 'post',
          url: this.$apiAddress,
          headers: headers,
          ...options,
        })
        console.log(res)
  },
  watch: {
    '$route': 'fetchData'
  },
  created () {
    this.fetchData()
  }
}
</script>

<style>

</style>