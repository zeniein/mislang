<template>
  <div class="container mx-auto p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">内容管理</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 内容列表管理卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-center gap-3">
            <h2 class="card-title">内容列表</h2>
            <div class="badge badge-primary">{{ articlesCount || 0 }}</div>
          </div>
          <p class="text-base-content/70">管理所有的内容文章，包括创建、编辑和删除操作</p>
          <div class="card-actions justify-end mt-4">
            <router-link to="/admin/content/articles" class="btn btn-primary">
              管理内容
            </router-link>
          </div>
        </div>
      </div>

      <!-- 评论管理卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-center gap-3">
            <h2 class="card-title">评论管理</h2>
            <div class="badge badge-secondary">{{ pendingComments || 0 }}</div>
          </div>
          <p class="text-base-content/70">管理文章评论，审核和回复用户的评论内容</p>
          <div class="card-actions justify-end mt-4">
            <router-link to="/admin/content/comments" class="btn btn-primary">
              管理评论
            </router-link>
          </div>
        </div>
      </div>

      <!-- 分类管理卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-center gap-3">
            <h2 class="card-title">分类管理</h2>
            <div class="badge badge-primary">{{ categoriesCount || 0 }}</div>
          </div>
          <p class="text-base-content/70">管理内容分类，创建和组织你的内容结构</p>
          <div class="card-actions justify-end mt-4">
            <router-link to="/admin/content/categories" class="btn btn-primary">
              管理分类
            </router-link>
          </div>
        </div>
      </div>

      <!-- 标签管理卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-center gap-3">
            <h2 class="card-title">标签管理</h2>
            <div class="badge badge-primary">{{ tagsCount || 0 }}</div>
          </div>
          <p class="text-base-content/70">管理内容标签，更好地组织和检索内容</p>
          <div class="card-actions justify-end mt-4">
            <router-link to="/admin/content/tags" class="btn btn-primary">
              管理标签
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 统计数据
const articlesCount = ref(0)
const pendingComments = ref(2)  // 待审核评论数
const categoriesCount = ref(0)
const tagsCount = ref(0)

// 获取统计数据
async function fetchStats() {
  try {
    // TODO: 调用后端API获取实际数据
    articlesCount.value = 12
    pendingComments.value = 2
    categoriesCount.value = 5
    tagsCount.value = 15
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 页面加载时获取数据
fetchStats()
</script>
