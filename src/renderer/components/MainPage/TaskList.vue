<script>
import Task from '@/components/MainPage/Task'
import net from '@/modules/net'
import state from '@/modules/state'
export default {
  name: 'Tasklist',
  components: { Task },
  data () {
    return {
      error: null,
      state: state.state
    }
  },
  watch: { $route: 'fetchData' },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.error = null
      try {
        await net.getTasks()
      } catch (error) {
        this.error = error
      }
    }
  }
}
</script>

<template>
  <div class="tasklist">
    <div v-if="state.tasks">
      <Task
        v-for="task in state.tasks"
        :key="task.taskid"
        :task="task"
      />
    </div>
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </div>
</template>

<style></style>
