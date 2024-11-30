<!-- Email Templates Management -->
<template>
  <div class="container mx-auto p-4">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">邮件模板管理</h1>
      <button class="btn btn-primary" @click="createTemplate">新建模板</button>
    </div>

    <!-- Template List -->
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>模板名称</th>
            <th>类型</th>
            <th>最后修改时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="template in templates" :key="template.id">
            <td>{{ template.name }}</td>
            <td>{{ template.type === 'html' ? 'HTML' : '纯文本' }}</td>
            <td>{{ formatDate(template.updatedAt) }}</td>
            <td class="space-x-2">
              <button class="btn btn-sm" @click="editTemplate(template)">编辑</button>
              <button class="btn btn-sm" @click="previewTemplate(template)">预览</button>
              <button class="btn btn-sm btn-error" @click="deleteTemplate(template)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Template Editor Modal -->
    <dialog ref="editorModal" class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="mb-4 text-lg font-bold">
          {{ isEditing ? '编辑模板' : '新建模板' }}
        </h3>
        
        <form @submit.prevent="saveTemplate" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">模板名称</span>
            </label>
            <input
              v-model="currentTemplate.name"
              type="text"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">模板类型</span>
            </label>
            <select v-model="currentTemplate.type" class="select select-bordered" required>
              <option value="html">HTML</option>
              <option value="text">纯文本</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">模板内容</span>
            </label>
            <div class="h-[600px] w-full rounded border">
              <MonacoEditor
                v-model="currentTemplate.content"
                :language="currentTemplate.type === 'html' ? 'html' : 'plaintext'"
                theme="vs-dark"
                class="h-full w-full"
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">可用变量</span>
            </label>
            <div class="grid grid-cols-2 gap-4 rounded-lg bg-base-200 p-4 md:grid-cols-3">
              <div
                v-for="(desc, key) in availableVariables"
                :key="key"
                class="flex items-center justify-between rounded bg-base-100 p-2"
              >
                <code class="text-sm">{{ key }}</code>
                <span class="text-sm text-base-content/70">{{ desc }}</span>
              </div>
            </div>
          </div>

          <div class="modal-action">
            <button type="button" class="btn" @click="closeEditor">取消</button>
            <button type="submit" class="btn btn-primary">保存</button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Preview Modal -->
    <dialog ref="previewModal" class="modal">
      <form method="dialog" class="modal-backdrop">
        <button>关闭</button>
      </form>
      <div class="modal-box max-h-none w-11/12 max-w-5xl">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="mb-4 text-lg font-bold">预览模板</h3>
        
        <div class="mb-4 space-y-4">
          <div class="flex flex-wrap gap-4">
            <div v-for="(value, key) in previewData" :key="key" class="form-control">
              <label class="label">
                <span class="label-text">{{ availableVariables[key] }}</span>
              </label>
              <input
                v-model="previewData[key]"
                type="text"
                class="input input-bordered input-sm"
              />
            </div>
          </div>
        </div>

        <div class="preview-section">
          <div class="preview-container">
            <div class="preview-scroll">
              <div class="preview-content" v-html="previewContent"></div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MonacoEditor from '@/components/MonacoEditor.vue'

interface Template {
  id: string
  name: string
  type: 'html' | 'text'
  content: string
  updatedAt: Date
}

// 可用的模板变量
const availableVariables = {
  '${userName}': '用户名',
  '${userEmail}': '用户邮箱',
  '${companyName}': '公司名称',
  '${verificationCode}': '验证码',
  '${resetLink}': '重置链接',
  '${expirationTime}': '过期时间'
}

// 模拟数据
const templates = ref<Template[]>([
  {
    id: '1',
    name: '欢迎邮件',
    type: 'html',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-radius: 5px;
    }
    .content {
      padding: 20px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #666;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>欢迎加入 \${companyName}</h1>
  </div>
  
  <div class="content">
    <p>亲爱的 \${userName}：</p>
    <p>感谢您注册我们的服务！我们很高兴能够为您提供支持。</p>
    <p>您的账号信息如下：</p>
    <ul>
      <li>用户名：\${userName}</li>
      <li>邮箱：\${userEmail}</li>
    </ul>
    <p>如需帮助，请随时与我们联系。</p>
    
    <a href="#" class="button">开始使用</a>
  </div>

  <div class="footer">
    <p>此邮件由系统自动发送，请勿直接回复</p>
    <p>© \${companyName} 版权所有</p>
  </div>
</body>
</html>`,
    updatedAt: new Date()
  },
  {
    id: '2',
    name: '验证码',
    type: 'text',
    content: `亲爱的用户：

您的验证码是：\${verificationCode}
该验证码将在 \${expirationTime} 分钟内有效。

如果这不是您的操作，请忽略此邮件。

祝好，
\${companyName} 团队`,
    updatedAt: new Date()
  },
  {
    id: '3',
    name: '密码重置',
    type: 'html',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-radius: 5px;
    }
    .content {
      padding: 20px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #666;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .warning {
      color: #dc3545;
      font-size: 12px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>密码重置请求</h1>
  </div>
  
  <div class="content">
    <p>亲爱的 \${userName}：</p>
    <p>我们收到了您的密码重置请求。如果这是您的操作，请点击下面的按钮重置密码：</p>
    
    <a href="\${resetLink}" class="button">重置密码</a>
    
    <p>或者复制以下链接到浏览器：</p>
    <p style="word-break: break-all;">\${resetLink}</p>
    
    <p class="warning">注意：此链接将在 \${expirationTime} 分钟后失效。如果您没有请求重置密码，请忽略此邮件。</p>
  </div>

  <div class="footer">
    <p>此邮件由系统自动发送，请勿直接回复</p>
    <p>© \${companyName} 版权所有</p>
  </div>
</body>
</html>`,
    updatedAt: new Date()
  }
])

const editorModal = ref<HTMLDialogElement>()
const previewModal = ref<HTMLDialogElement>()
const currentTemplate = ref<Partial<Template>>({
  type: 'html',
  content: ''
})
const isEditing = ref(false)
const previewData = ref({
  userName: 'John Doe',
  userEmail: 'john@example.com',
  companyName: 'MisLang',
  verificationCode: '123456',
  resetLink: 'https://example.com/reset',
  expirationTime: '30'
})
const previewContent = ref('')

// 格式化日期
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 刷新预览内容
const refreshPreview = () => {
  if (!currentTemplate.value?.content) {
    previewContent.value = ''
    return
  }

  let content = currentTemplate.value.content
  
  // 替换所有变量
  Object.entries(previewData.value).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g')
    content = content.replace(regex, value)
  })

  if (currentTemplate.value.type === 'html') {
    // 为 HTML 内容添加基础样式和容器
    content = `
      <div class="email-preview">
        ${content}
      </div>
      <style>
        .email-preview {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .email-preview * {
          max-width: 100%;
          box-sizing: border-box;
          margin-left: 0;
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .email-preview img {
          height: auto;
          display: block;
        }
        .email-preview a {
          color: #007bff;
          text-decoration: none;
        }
        .email-preview a:hover {
          text-decoration: underline;
        }
        .email-preview table {
          width: 100% !important;
          table-layout: fixed;
        }
        .email-preview td, .email-preview th {
          word-break: break-word;
          overflow-wrap: break-word;
        }
      </style>
    `
  } else {
    // 为纯文本添加预格式化样式
    content = `<pre style="white-space: pre-wrap; font-family: monospace; margin: 0; max-width: 100%; overflow-x: hidden;">${content}</pre>`
  }

  previewContent.value = content
}

// 监听预览数据变化
watch(previewData, () => {
  refreshPreview()
}, { deep: true })

// 监听当前模板变化
watch(() => currentTemplate.value?.content, () => {
  refreshPreview()
})

// 创建新模板
const createTemplate = () => {
  currentTemplate.value = {
    type: 'html',
    content: ''
  }
  isEditing.value = false
  editorModal.value?.showModal()
}

// 编辑模板
const editTemplate = (template: Template) => {
  currentTemplate.value = { ...template }
  isEditing.value = true
  editorModal.value?.showModal()
}

// 预览模板
const previewTemplate = (template: Template) => {
  currentTemplate.value = { ...template }
  refreshPreview()
  previewModal.value?.showModal()
}

// 保存模板
const saveTemplate = () => {
  if (isEditing.value) {
    const index = templates.value.findIndex(t => t.id === currentTemplate.value.id)
    if (index !== -1) {
      templates.value[index] = {
        ...templates.value[index],
        ...currentTemplate.value,
        updatedAt: new Date()
      } as Template
    }
  } else {
    templates.value.push({
      ...currentTemplate.value,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: new Date()
    } as Template)
  }
  closeEditor()
}

// 删除模板
const deleteTemplate = (template: Template) => {
  if (confirm('确定要删除这个模板吗？')) {
    templates.value = templates.value.filter(t => t.id !== template.id)
  }
}

// 关闭编辑器
const closeEditor = () => {
  editorModal.value?.close()
}

// 关闭预览
const closePreview = () => {
  previewModal.value?.close()
}
</script>

<style scoped>
.modal-box {
  @apply relative;
  margin: 1.5rem auto;
}

.preview-section {
  @apply relative -mx-6 bg-white;
  height: 60vh;
}

.preview-container {
  @apply absolute inset-0 overflow-hidden;
  padding: 1rem;
}

.preview-scroll {
  @apply h-full overflow-auto;
  padding: 1rem;
}

.preview-content {
  @apply relative mx-auto w-full;
  max-width: 100%;
}

:deep(.preview-content) {
  & * {
    max-width: 100% !important;
    box-sizing: border-box;
  }

  & img {
    height: auto;
    display: block;
  }

  & table {
    width: 100% !important;
    table-layout: fixed;
  }

  & td,
  & th {
    word-break: break-word;
  }
}

/* 防止模态框影响页面宽度 */
:deep(.modal) {
  @apply fixed inset-0;
  width: 100vw !important;
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

:deep(.modal-backdrop) {
  @apply fixed inset-0;
  background-color: rgba(0, 0, 0, 0.3);
}

:deep(.modal-backdrop button) {
  @apply hidden;
}
</style>
