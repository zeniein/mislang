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
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="text-lg font-bold">{{ isEditing ? '编辑模板' : '新建模板' }}</h3>
          <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" @click="closeEditor">✕</button>
        </div>
        
        <div class="modal-body">
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
              <div class="grid-variables rounded-lg bg-base-200 p-4">
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

            <div class="modal-footer">
              <button type="button" class="btn" @click="closeEditor">取消</button>
              <button type="submit" class="btn btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>关闭</button>
      </form>
    </dialog>

    <!-- Preview Modal -->
    <dialog ref="previewModal" class="modal">
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="text-lg font-bold">预览模板</h3>
          <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" @click="closePreview">✕</button>
        </div>
        
        <div class="modal-body">
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
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closePreview">关闭</button>
      </form>
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
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px;">
    <h1 style="margin: 0; color: #333;">\${companyName}</h1>
  </div>
  
  <div style="padding: 20px;">
    <p style="margin: 10px 0;">亲爱的 \${userName}：</p>
    <p style="margin: 10px 0;">感谢您注册我们的服务！我们很高兴能够为您提供支持。</p>
    <p style="margin: 10px 0;">您的账号信息如下：</p>
    <ul style="margin: 10px 0; padding-left: 20px;">
      <li style="margin: 5px 0;">用户名：\${userName}</li>
      <li style="margin: 5px 0;">邮箱：\${userEmail}</li>
    </ul>
    <p style="margin: 10px 0;">如需帮助，请随时与我们联系。</p>
    
    <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">开始使用</a>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
    <p style="margin: 5px 0;">此邮件由系统自动发送，请勿直接回复</p>
    <p style="margin: 5px 0;">© \${companyName} 版权所有</p>
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

此邮件由系统自动发送，请勿直接回复。`,
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
    // 为 HTML 内容添加预览容器和样式重置
    content = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; width: 100%; max-width: 100%; margin: 0 auto; padding: 0; box-sizing: border-box; overflow-x: hidden;">
        ${content}
      </div>
    `
  } else {
    // 为纯文本添加预格式化样式
    content = `<pre style="white-space: pre-wrap; font-family: monospace; margin: 0; padding: 0; width: 100%; max-width: 100%; overflow-x: hidden; color: #333; line-height: 1.5;">${content}</pre>`
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
  @apply relative flex flex-col h-[90vh] mx-6 p-0 w-[95vw] max-w-[1200px];
}

@screen sm {
  .modal-box {
    @apply h-[98vh] mx-2 w-[calc(100vw-0.5rem)];
  }
}

.modal-header {
  @apply sticky top-0 z-10 flex items-center justify-between bg-base-100 border-b border-base-300 p-6;
}

@screen sm {
  .modal-header {
    @apply p-4;
  }
}

.modal-body {
  @apply flex-1 overflow-y-auto p-6;
}

@screen sm {
  .modal-body {
    @apply p-4;
  }
}

.modal-footer {
  @apply mt-4 flex justify-end gap-2 border-t border-base-300 p-6;
}

@screen sm {
  .modal-footer {
    @apply mt-2 p-4;
  }
}

.preview-section {
  @apply relative bg-white h-[calc(90vh-200px)] m-0 p-0 w-full max-w-full overflow-hidden;
}

@screen sm {
  .preview-section {
    @apply h-[calc(98vh-180px)];
  }
}

.preview-container {
  @apply absolute inset-0 p-4 w-full max-w-full overflow-hidden;
}

.preview-scroll {
  @apply h-full w-full max-w-full overflow-auto p-4;
}

.preview-content {
  @apply relative mx-auto w-full max-w-full overflow-x-hidden;
}

/* 编辑器相关样式 */
.form-control {
  @apply w-full;
}

@screen sm {
  .monaco-editor {
    @apply !h-[400px];
  }
}

.grid-variables {
  @apply grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))];
}

@screen sm {
  .grid-variables {
    @apply grid-cols-1;
  }
}

/* 模态框样式 */
:global(body:has(dialog[open])) {
  @apply overflow-hidden pr-0 max-w-none;
}

:deep(.modal) {
  @apply fixed inset-0 w-screen max-w-full overflow-hidden p-4;
}

@screen sm {
  :deep(.modal) {
    @apply p-0;
  }
}

:deep(.modal[open]) {
  @apply flex items-start justify-center pt-16;
}

@screen sm {
  :deep(.modal[open]) {
    @apply pt-8;
  }
}

:deep(.modal-backdrop) {
  @apply fixed inset-0 bg-black/30;
}

:deep(.modal-backdrop button) {
  @apply hidden;
}
</style>
