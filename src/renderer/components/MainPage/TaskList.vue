<script>
import Task from '@/components/MainPage/Task'
import net from '@/modules/net'
export default {
  name: 'Tasklist',
  components: { Task },
  data () {
    return {
      loading: false,
      tasks: null,
      error: null
    }
  },
  watch: { $route: 'fetchData' },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.error = this.tasks = null
      this.loading = true
      const res = await net.post('/getTask/all')
      if (res.data.success) {
        this.tasks = res.data.tasks
        this.loading = false
      } else {
        this.loading = false
        this.error = res.data.error
      }
    }
  }
}
</script>

<template>
  <div class="tasklist">
    <div v-if="tasks">
      <Task
        v-for="task in tasks"
        :key="task.taskid"
        :task="task"
      />
    </div>
    <b-loading
      :active="loading"
      :is-full-page="false"
      :can-cancel="false"
    />
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </div>
</template>

<style></style>
