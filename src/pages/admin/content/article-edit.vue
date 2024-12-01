<template>
  <div class="min-h-screen flex flex-col">
    <!-- 顶部操作栏 -->
    <div class="fixed lg:static top-0 left-0 right-0 z-50 bg-base-100 border-b lg:border-none">
      <!-- 移动端显示 -->
      <div class="lg:hidden flex items-center justify-between px-4 h-14">
        <div class="flex items-center gap-2">
          <button class="btn btn-square btn-ghost" @click="$router.back()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-lg font-medium">编辑文章</h1>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-primary btn-sm" @click="handleSave">保存</button>
          <button class="btn btn-square btn-ghost" @click="toggleSettings">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- PC端显示 -->
      <div class="hidden lg:flex container mx-auto px-4 h-16 items-center justify-between">
        <div class="flex items-center gap-4">
          <button class="btn btn-ghost" @click="$router.back()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-xl font-medium">编辑文章</h1>
        </div>
        <div class="flex items-center gap-4">
          <button class="btn btn-primary" @click="handleSave">保存</button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 lg:mt-0 mt-14">
      <div class="container mx-auto px-4 py-4 max-w-7xl">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- 左侧编辑区域 -->
          <div class="w-full lg:w-7/12 xl:w-8/12 space-y-4">
            <!-- Markdown 编辑器 -->
            <div class="card bg-base-100 shadow h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)]">
              <div class="card-body !p-0 h-full">
                <MdEditor
                  v-model="article.content"
                  :theme="isDark ? 'dark' : 'light'"
                  :toolbars="toolbars"
                  :preview="true"
                  @onUploadImg="onUploadImg"
                  class="h-full"
                />
              </div>
            </div>
          </div>

          <!-- 右侧设置面板 -->
          <div 
            class="w-full lg:w-5/12 xl:w-4/12 space-y-4 fixed lg:static inset-0 bg-base-100 lg:bg-transparent transform transition-transform duration-300 z-40"
            :class="[showSettings ? 'translate-x-0' : 'translate-x-full lg:translate-x-0']"
          >
            <!-- 移动端顶部 -->
            <div class="lg:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-base-100 z-10">
              <h2 class="text-lg font-medium">文章设置</h2>
              <button class="btn btn-square btn-ghost" @click="toggleSettings">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- 设置内容区域 -->
            <div class="p-4 lg:p-0 overflow-y-auto h-[calc(100vh-4rem)] lg:h-auto">
              <div class="space-y-4">
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

                    <div class="divider"></div>

                    <h3 class="font-medium mb-3">评论设置</h3>
                    
                    <div class="form-control">
                      <label class="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" class="toggle toggle-primary" v-model="article.allowComments" />
                        <span class="label-text">允许评论</span>
                      </label>
                    </div>

                    <div class="mt-4 space-y-4" v-if="article.allowComments">
                      <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-3">
                          <input type="checkbox" class="toggle toggle-primary" v-model="article.commentSettings.requireApproval" />
                          <span class="label-text">评论需要审核</span>
                        </label>
                      </div>

                      <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-3">
                          <input type="checkbox" class="toggle toggle-primary" v-model="article.commentSettings.allowReplies" />
                          <span class="label-text">允许回复评论</span>
                        </label>
                      </div>

                      <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-3">
                          <input type="checkbox" class="toggle toggle-primary" v-model="article.commentSettings.allowAnonymous" />
                          <span class="label-text">允许匿名评论</span>
                        </label>
                      </div>

                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">评论排序</span>
                        </label>
                        <select class="select select-bordered w-full" v-model="article.commentSettings.sortOrder">
                          <option value="newest">最新评论优先</option>
                          <option value="oldest">最早评论优先</option>
                          <option value="popular">热门评论优先</option>
                        </select>
                      </div>

                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">每页评论数</span>
                        </label>
                        <select class="select select-bordered w-full" v-model="article.commentSettings.pageSize">
                          <option value="10">10条/页</option>
                          <option value="20">20条/页</option>
                          <option value="30">30条/页</option>
                          <option value="50">50条/页</option>
                        </select>
                      </div>

                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">评论字数限制</span>
                        </label>
                        <div class="flex gap-2">
                          <div class="flex-1">
                            <input 
                              type="number" 
                              class="input input-bordered w-full" 
                              v-model="article.commentSettings.minLength"
                              min="1"
                              placeholder="最小字数"
                            />
                          </div>
                          <div class="flex-1">
                            <input 
                              type="number" 
                              class="input input-bordered w-full" 
                              v-model="article.commentSettings.maxLength"
                              min="1"
                              placeholder="最大字数"
                            />
                          </div>
                        </div>
                      </div>
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

          <!-- 遮罩层 -->
          <div 
            v-if="showSettings" 
            class="fixed inset-0 bg-base-content/20 z-30 lg:hidden"
            @click="toggleSettings"
          ></div>
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
const showSettings = ref(false)  // 控制设置面板显示状态

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
  updatedAt: '',
  allowComments: false,
  commentSettings: {
    requireApproval: false,
    allowReplies: false,
    allowAnonymous: false,
    sortOrder: 'newest',
    pageSize: 10,
    minLength: 1,
    maxLength: 1000
  }
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

// 切换设置面板显示状态
const toggleSettings = () => {
  showSettings.value = !showSettings.value
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
