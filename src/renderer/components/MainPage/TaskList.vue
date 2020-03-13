<template>
	<div v-if="tasks">
		<Task v-for="task in tasks" :key="task.taskid" v-bind:task="task"></Task>
	</div>
</template>

<script>
import Task from '@/components/MainPage/Task'

export default {
  name: 'tasklist',
  components: { Task },
  props: ['tasks'],
  methods: {
    async fetchData () {
      this.error = this.tasks = null
      this.loading = true
      const res = this.net.post('/getTasks/all')
      console.log(res)
    },
    watch: {
      '$route': 'fetchData'
    },
    created () {
      this.fetchData()
    }
  }
}
</script>

<style>

</style>