<route lang="yaml">
name: admin-schedule
meta:
  requiresAuth: true
  layout: admin
  title: 日程安排
</route>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">日程安排</h2>

    <!-- Add Schedule Form -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <h3 class="card-title mb-4">新建日程</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">标题</span>
            </label>
            <input
              type="text"
              v-model="scheduleForm.title"
              class="input input-bordered"
              placeholder="输入日程标题"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">描述</span>
            </label>
            <textarea
              v-model="scheduleForm.description"
              class="textarea textarea-bordered h-24"
              placeholder="输入日程描述"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">开始时间</span>
              </label>
              <input
                type="datetime-local"
                v-model="scheduleForm.startTime"
                class="input input-bordered"
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">结束时间</span>
              </label>
              <input
                type="datetime-local"
                v-model="scheduleForm.endTime"
                class="input input-bordered"
                required
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">类型</span>
            </label>
            <select v-model="scheduleForm.type" class="select select-bordered w-full">
              <option value="meeting">会议</option>
              <option value="task">任务</option>
              <option value="reminder">提醒</option>
              <option value="deadline">截止日期</option>
            </select>
          </div>

          <div class="card-actions justify-end">
            <button type="submit" class="btn btn-primary">添加日程</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Calendar View -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h3 class="card-title">日历视图</h3>
          <div class="flex gap-2">
            <button class="btn btn-sm" @click="previousMonth">&lt;</button>
            <span class="text-lg font-semibold">{{ currentMonthLabel }}</span>
            <button class="btn btn-sm" @click="nextMonth">&gt;</button>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Weekday Headers -->
          <div v-for="day in weekDays" :key="day" class="p-2 text-center font-semibold">
            {{ day }}
          </div>

          <!-- Calendar Days -->
          <div
            v-for="date in calendarDays"
            :key="date.toISOString()"
            class="min-h-[100px] p-2 border rounded-lg"
            :class="[
              isToday(date) ? 'border-primary' : 'border-base-300',
              isCurrentMonth(date) ? 'bg-base-100' : 'bg-base-200 opacity-50'
            ]"
          >
            <div class="text-sm mb-1">{{ date.getDate() }}</div>
            <!-- Events for this day -->
            <div class="space-y-1">
              <div
                v-for="event in getEventsForDate(date)"
                :key="event.id"
                class="text-xs p-1 rounded cursor-pointer"
                :class="getEventTypeClass(event.type)"
                @click="handleEditEvent(event)"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event List for Selected Date -->
    <div v-if="selectedDateEvents.length" class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title mb-4">{{ formatDate(selectedDate) }}的日程</h3>
        <div class="space-y-4">
          <div
            v-for="event in selectedDateEvents"
            :key="event.id"
            class="flex justify-between items-center p-4 border rounded-lg"
          >
            <div>
              <h4 class="font-semibold">{{ event.title }}</h4>
              <p class="text-sm opacity-70">{{ event.description }}</p>
              <div class="text-sm mt-1">
                {{ formatDateTime(event.startTime) }} - {{ formatDateTime(event.endTime) }}
              </div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-ghost" @click="handleEditEvent(event)">编辑</button>
              <button class="btn btn-sm btn-error" @click="handleDeleteEvent(event)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Event {
  id: number
  title: string
  description: string
  startTime: string
  endTime: string
  type: 'meeting' | 'task' | 'reminder' | 'deadline'
}

const scheduleForm = ref({
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  type: 'meeting' as const
})

const events = ref<Event[]>([])
const selectedDate = ref(new Date())
const currentMonth = ref(new Date())

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const currentMonthLabel = computed(() => {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long' }).format(
    currentMonth.value
  )
})

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1)
  const lastDay = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 0)

  // Add days from previous month
  const firstDayWeekday = firstDay.getDay()
  for (let i = firstDayWeekday; i > 0; i--) {
    days.push(new Date(firstDay.getTime() - i * 24 * 60 * 60 * 1000))
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), i))
  }

  // Add days from next month
  const remainingDays = 42 - days.length // Always show 6 weeks
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(lastDay.getTime() + i * 24 * 60 * 60 * 1000))
  }

  return days
})

const selectedDateEvents = computed(() => {
  return events.value.filter(event => {
    const eventDate = new Date(event.startTime)
    return isSameDay(eventDate, selectedDate.value)
  })
})

const handleSubmit = () => {
  events.value.push({
    ...scheduleForm.value,
    id: Date.now()
  })
  resetForm()
}

const handleEditEvent = (event: Event) => {
  scheduleForm.value = { ...event }
}

const handleDeleteEvent = (event: Event) => {
  events.value = events.value.filter(e => e.id !== event.id)
}

const resetForm = () => {
  scheduleForm.value = {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'meeting'
  }
}

const previousMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1)
}

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString()
}

const isToday = (date: Date) => {
  const today = new Date()
  return isSameDay(date, today)
}

const isCurrentMonth = (date: Date) => {
  return date.getMonth() === currentMonth.value.getMonth()
}

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const getEventsForDate = (date: Date) => {
  return events.value.filter(event => isSameDay(new Date(event.startTime), date))
}

const getEventTypeClass = (type: string) => {
  const classes: Record<string, string> = {
    meeting: 'bg-primary text-primary-content',
    task: 'bg-secondary text-secondary-content',
    reminder: 'bg-accent text-accent-content',
    deadline: 'bg-error text-error-content'
  }
  return classes[type] || ''
}
</script>
