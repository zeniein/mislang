<template>
  <div class="space-y-4 container mx-auto px-4 py-4 max-w-7xl">
    <!-- 顶部操作栏 -->
    <div class="sticky top-0 z-10 -mx-4 px-4 py-2 bg-base-100 shadow-sm flex justify-between items-center">
      <h1 class="text-xl md:text-2xl font-bold truncate">{{ isEdit ? '编辑文章' : '新建文章' }}</h1>
      <div class="flex items-center space-x-2">
        <button class="btn btn-ghost btn-sm md:btn-md" @click="router.back()">取消</button>
        <button class="btn btn-primary btn-sm md:btn-md" @click="handleSave">保存</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- 左侧编辑区域 -->
      <div class="lg:col-span-2 space-y-4">
        <!-- 标题输入 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <input 
              type="text" 
              v-model="article.title" 
              placeholder="请输入文章标题" 
              class="input input-lg input-bordered w-full text-xl font-medium" 
            />
          </div>
        </div>

        <!-- Markdown 编辑器 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body !p-0">
            <MdEditor
              v-model="article.content"
              :theme="isDark ? 'dark' : 'light'"
              :toolbars="toolbars"
              :preview="true"
              @onUploadImg="onUploadImg"
              class="md-editor h-[calc(100vh-20rem)] md:h-[calc(100vh-16rem)]"
            />
          </div>
        </div>
      </div>

      <!-- 右侧设置面板 -->
      <div class="space-y-4">
        <!-- 发布设置 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title text-lg mb-4">发布设置</h2>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">状态</span>
              </label>
              <select class="select select-bordered w-full" v-model="article.status">
                <option value="draft">草稿</option>
                <option value="published">发布</option>
              </select>
            </div>

            <div class="form-control mt-4">
              <label class="label">
                <span class="label-text">分类</span>
              </label>
              <select class="select select-bordered w-full" v-model="article.categoryId">
                <option value="">请选择分类</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- 封面图片 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title text-lg mb-4">封面图片</h2>
            <div class="space-y-4">
              <div 
                class="aspect-video w-full bg-base-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-base-300 transition-colors relative group"
                @click="handleSelectCover"
              >
                <template v-if="article.coverUrl">
                  <img :src="article.coverUrl" class="w-full h-full object-cover rounded-lg" />
                  <div class="absolute inset-0 bg-base-content/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span class="text-base-100">点击更换</span>
                  </div>
                </template>
                <template v-else>
                  <div class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm text-base-content/50">点击上传封面</span>
                  </div>
                </template>
              </div>
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden" 
                accept="image/*"
                @change="handleCoverChange"
              />
              <div v-if="article.coverUrl" class="flex justify-end">
                <button class="btn btn-sm btn-ghost text-error" @click="handleRemoveCover">
                  删除封面
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章摘要 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title text-lg mb-4">文章摘要</h2>
            <textarea 
              v-model="article.summary" 
              class="textarea textarea-bordered h-24" 
              placeholder="请输入文章摘要，将显示在文章列表中"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { MdEditor, type ToolbarNames } from 'md-editor-v3'
import type { UploadImgEvent } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const router = useRouter()
const route = useRoute()
const { isDark } = useTheme()

const isEdit = computed(() => route.params.id !== undefined)
const preview = ref(true) // 默认开启预览模式
const fileInput = ref<HTMLInputElement>()

// 编辑器工具栏配置
const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'preview',
  'htmlPreview',
  'catalog',
  'prettier'
]

// 模拟分类数据
const categories = ref([
  { id: 1, name: '技术' },
  { id: 2, name: '生活' },
  { id: 3, name: '随笔' }
])

// 文章数据
const article = ref({
  id: undefined,
  title: '',
  content: '',
  summary: '',
  categoryId: '',
  status: 'draft',
  coverUrl: '',
  createdAt: '',
  updatedAt: ''
})

// 处理图片上传
const onUploadImg: UploadImgEvent = async (files: File[], callback: (urls: string[]) => void) => {
  const urls: string[] = []
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        urls.push(e.target.result as string)
        if (urls.length === files.length) {
          callback(urls)
        }
      }
    }
    reader.readAsDataURL(file)
  }
}

// 处理封面图片
const handleSelectCover = () => {
  fileInput.value?.click()
}

const handleCoverChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // TODO: 上传图片到服务器
    const reader = new FileReader()
    reader.onload = (e) => {
      article.value.coverUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleRemoveCover = () => {
  article.value.coverUrl = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 保存文章
const handleSave = async () => {
  try {
    // TODO: 保存文章到服务器
    console.log('保存文章:', article.value)
    router.push('/admin/content/articles')
  } catch (error) {
    console.error('保存文章失败:', error)
  }
}

// 如果是编辑模式，加载文章数据
if (isEdit.value) {
  // TODO: 从服务器加载文章数据
}
</script>

<style>
/* 适配暗色主题 */
:root[data-theme="dark"] .md-editor {
  --md-bk-color: hsl(var(--b1)) !important;
  --md-color: hsl(var(--bc)) !important;
  --md-border-color: hsl(var(--b3)) !important;
}

/* 移动端工具栏优化 */
@media (max-width: 768px) {
  .md-editor .md-toolbar {
    flex-wrap: wrap;
    height: auto !important;
    padding: 4px !important;
  }
  
  .md-editor .md-toolbar > div {
    margin: 2px !important;
  }
}

/* 去除中间分割线和滚动条 */
.md-editor {
  border: none !important;
}

.md-editor .md-content {
  border: none !important;
}

.md-editor .md-content-editor,
.md-editor .md-preview {
  padding: 1rem !important;
}

/* 自定义滚动条样式 */
.md-editor .md-content-editor::-webkit-scrollbar,
.md-editor .md-preview::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.md-editor .md-content-editor::-webkit-scrollbar-thumb,
.md-editor .md-preview::-webkit-scrollbar-thumb {
  background: hsl(var(--bc) / 0.2);
  border-radius: 3px;
}

.md-editor .md-content-editor::-webkit-scrollbar-track,
.md-editor .md-preview::-webkit-scrollbar-track {
  background: transparent;
}

/* 优化预览区域样式 */
.md-editor .md-preview {
  background: transparent !important;
}

/* 优化工具栏样式 */
.md-editor .md-toolbar {
  border-bottom: 1px solid hsl(var(--b3)) !important;
  background: hsl(var(--b2)) !important;
}

/* 优化编辑器和预览区的分隔线 */
.md-editor .md-content > div.md-divider {
  display: none !important;
}
</style>
