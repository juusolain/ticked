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
    },
    createTask (event) {
      console.log('Creating new task, ', event.target)
      event.target.blur()
      const name = event.target.text
      console.log(name)
      event.target.text = ''
      console.log(event.target.text)
      net.createTask({
        name: name
      })
    }
  }
}
</script>

<template>
  <div class="tasklist">
    <div class="newtask">
      <b-field>
        <b-input
          placeholder="New task"
          size="is-medium"
          @keyup.native.enter="createTask"
        />
      </b-field>
    </div>
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
