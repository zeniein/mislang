<route lang="yaml">
name: admin-todo
meta:
  requiresAuth: true
  layout: admin
  title: 待办事项
</route>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">待办事项</h2>
    
    <!-- Add TODO Form -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <h3 class="card-title mb-4">新建待办</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">标题</span>
            </label>
            <input 
              type="text" 
              v-model="todoForm.title" 
              class="input input-bordered" 
              placeholder="输入待办标题"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">描述</span>
            </label>
            <textarea 
              v-model="todoForm.description" 
              class="textarea textarea-bordered h-24" 
              placeholder="输入待办描述"
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">截止日期</span>
            </label>
            <input 
              type="datetime-local" 
              v-model="todoForm.dueDate" 
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">优先级</span>
            </label>
            <select v-model="todoForm.priority" class="select select-bordered w-full">
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>

          <div class="card-actions justify-end">
            <button type="submit" class="btn btn-primary">添加待办</button>
          </div>
        </form>
      </div>
    </div>

    <!-- TODO List -->
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>标题</th>
            <th>描述</th>
            <th>截止日期</th>
            <th>优先级</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="todo in todos" :key="todo.id" :class="{'opacity-50': todo.status === 'completed'}">
            <td>{{ todo.title }}</td>
            <td>{{ todo.description }}</td>
            <td>{{ formatDate(todo.dueDate) }}</td>
            <td>
              <div class="badge" :class="getPriorityBadgeClass(todo.priority)">
                {{ getPriorityLabel(todo.priority) }}
              </div>
            </td>
            <td>
              <div class="badge" :class="todo.status === 'completed' ? 'badge-success' : 'badge-warning'">
                {{ todo.status === 'completed' ? '已完成' : '进行中' }}
              </div>
            </td>
            <td>
              <button 
                class="btn btn-sm"
                :class="todo.status === 'completed' ? 'btn-warning' : 'btn-success'"
                @click="handleComplete(todo)"
              >
                {{ todo.status === 'completed' ? '重新开始' : '完成' }}
              </button>
              <button class="btn btn-sm btn-error ml-2" @click="handleDelete(todo)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Todo {
  id: number
  title: string
  description: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed'
}

const todoForm = ref({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium' as const,
  status: 'pending' as const
})

const todos = ref<Todo[]>([])

const handleSubmit = () => {
  todos.value.push({
    ...todoForm.value,
    id: Date.now(),
  })
  resetForm()
}

const handleComplete = (todo: Todo) => {
  const index = todos.value.findIndex(t => t.id === todo.id)
  if (index !== -1) {
    todos.value[index].status = todo.status === 'completed' ? 'pending' : 'completed'
  }
}

const handleDelete = (todo: Todo) => {
  todos.value = todos.value.filter(t => t.id !== todo.id)
}

const resetForm = () => {
  todoForm.value = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const getPriorityLabel = (priority: string) => {
  const labels = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return labels[priority] || priority
}

const getPriorityBadgeClass = (priority: string) => {
  const classes = {
    high: 'badge-error',
    medium: 'badge-warning',
    low: 'badge-info'
  }
  return classes[priority] || ''
}
</script>

<style scoped>
.p-6 {
  padding: 20px;
}
</style>
