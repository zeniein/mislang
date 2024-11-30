<route lang="yaml">
name: settings

meta:
  requiresAuth: true
  layout: admin
  title: 系统设置
</route>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">系统设置</h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 基本设置 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">基本设置</h3>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">网站名称</span>
            </label>
            <input type="text" v-model="settings.siteName" class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">网站描述</span>
            </label>
            <textarea v-model="settings.description" class="textarea textarea-bordered h-24"></textarea>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">维护模式</span>
              <input type="checkbox" v-model="settings.maintenanceMode" class="toggle toggle-primary" />
            </label>
          </div>
        </div>
      </div>

      <!-- 主题设置 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">主题设置</h3>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">主题模式</span>
            </label>
            <select v-model="settings.theme" class="select select-bordered w-full">
              <option value="light">浅色模式</option>
              <option value="dark">深色模式</option>
              <option value="auto">跟随系统</option>
            </select>
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">主色调</span>
            </label>
            <select v-model="settings.primaryColor" class="select select-bordered w-full">
              <option value="blue">蓝色</option>
              <option value="green">绿色</option>
              <option value="purple">紫色</option>
              <option value="red">红色</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 邮件设置 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">邮件设置</h3>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">SMTP 服务器</span>
            </label>
            <input type="text" v-model="settings.smtp.host" class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">SMTP 端口</span>
            </label>
            <input type="number" v-model="settings.smtp.port" class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">邮箱账号</span>
            </label>
            <input type="email" v-model="settings.smtp.username" class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">邮箱密码</span>
            </label>
            <input type="password" v-model="settings.smtp.password" class="input input-bordered w-full" />
          </div>
        </div>
      </div>

      <!-- 其他设置 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">其他设置</h3>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">开启注册</span>
              <input type="checkbox" v-model="settings.enableRegistration" class="toggle toggle-primary" />
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">开启评论</span>
              <input type="checkbox" v-model="settings.enableComments" class="toggle toggle-primary" />
            </label>
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">每页显示数量</span>
            </label>
            <input type="number" v-model="settings.itemsPerPage" class="input input-bordered w-full" />
          </div>
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="mt-6 flex justify-end">
      <button class="btn btn-primary" @click="saveSettings">保存设置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface SMTPSettings {
  host: string
  port: number
  username: string
  password: string
}

interface Settings {
  siteName: string
  description: string
  maintenanceMode: boolean
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  smtp: SMTPSettings
  enableRegistration: boolean
  enableComments: boolean
  itemsPerPage: number
}

// 模拟设置数据
const settings = ref<Settings>({
  siteName: 'MisLang',
  description: '一个现代的 Vue 3 应用程序',
  maintenanceMode: false,
  theme: 'light',
  primaryColor: 'blue',
  smtp: {
    host: 'smtp.example.com',
    port: 587,
    username: 'noreply@example.com',
    password: ''
  },
  enableRegistration: true,
  enableComments: true,
  itemsPerPage: 10
})

const saveSettings = () => {
  // TODO: 实现保存设置的功能
  console.log('Save settings:', settings.value)
}
</script>
