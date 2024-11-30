<template>
  <div class="container mx-auto p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">内容管理</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 内容列表管理卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">内容列表</h2>
          <p class="text-base-content/70">管理所有的内容文章，包括创建、编辑和删除操作</p>
          <div class="card-actions justify-end mt-4">
            <router-link to="/admin/content/articles" class="btn btn-primary">
              管理内容
            </router-link>
          </div>
        </div>
      </div>

      <!-- 分类管理卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">分类管理</h2>
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
          <h2 class="card-title">标签管理</h2>
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
// 这里可以添加需要的逻辑
</script>
