<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">文章管理</h1>
      <router-link to="/admin/content/article-edit" class="btn btn-primary">
        新建文章
      </router-link>
    </div>

    <!-- 筛选器 -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">分类</span>
        </label>
        <select v-model="filters.category" class="select select-bordered w-full">
          <option value="">全部分类</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">状态</span>
        </label>
        <select v-model="filters.status" class="select select-bordered w-full">
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">搜索</span>
        </label>
        <input
          v-model="filters.search"
          type="text"
          placeholder="搜索标题..."
          class="input input-bordered w-full"
        />
      </div>
    </div>

    <!-- 内容列表 -->
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>标题</th>
            <th>分类</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in articles" :key="article.id">
            <td>{{ article.title }}</td>
            <td>{{ article.category?.name }}</td>
            <td>
              <div class="badge" :class="getStatusBadgeClass(article.status)">
                {{ getStatusText(article.status) }}
              </div>
            </td>
            <td>{{ formatDate(article.createdAt) }}</td>
            <td>
              <div class="flex items-center space-x-2">
                <router-link :to="`/admin/content/article-edit/${article.id}`" class="btn btn-sm">
                  编辑
                </router-link>
                <button class="btn btn-sm btn-error" @click="handleDelete(article)">
                  删除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="mt-4 flex justify-center">
      <div class="join">
        <button
          class="join-item btn"
          :class="{ 'btn-disabled': currentPage === 1 }"
          @click="currentPage--"
        >
          «
        </button>
        <button class="join-item btn">页码 {{ currentPage }}</button>
        <button
          class="join-item btn"
          :class="{ 'btn-disabled': !hasNextPage }"
          @click="currentPage++"
        >
          »
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 模拟数据
const categories = ref([
  { id: 1, name: '技术' },
  { id: 2, name: '设计' },
  { id: 3, name: '营销' }
])

const articles = ref([
  {
    id: 1,
    title: '示例文章1',
    category: { id: 1, name: '技术' },
    status: 'published',
    createdAt: new Date()
  },
  {
    id: 2,
    title: '示例文章2',
    category: { id: 2, name: '设计' },
    status: 'draft',
    createdAt: new Date()
  }
])

// 筛选条件
const filters = reactive({
  category: '',
  status: '',
  search: ''
})

// 分页
const currentPage = ref(1)
const hasNextPage = ref(true)

// 格式化日期
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    published: '已发布',
    draft: '草稿'
  }
  return statusMap[status] || status
}

// 获取状态徽章样式
const getStatusBadgeClass = (status: string) => {
  const classMap: Record<string, string> = {
    published: 'badge-success',
    draft: 'badge-warning'
  }
  return classMap[status] || ''
}

// 创建文章
const createArticle = () => {
  // TODO: 实现创建文章逻辑
}

// 编辑文章
const editArticle = (article: any) => {
  // TODO: 实现编辑文章逻辑
}

// 删除文章
const deleteArticle = (article: any) => {
  // TODO: 实现删除文章逻辑
}

const handleDelete = (article: any) => {
  // TODO: 实现删除文章逻辑
}
</script>
