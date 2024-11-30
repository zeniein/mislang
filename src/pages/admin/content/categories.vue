<template>
  <div class="container mx-auto p-4">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">分类管理</h1>
      <button class="btn btn-primary" @click="createCategory">新建分类</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 分类列表 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">分类列表</h2>
          
          <div class="space-y-4">
            <div
              v-for="category in categories"
              :key="category.id"
              class="flex items-center justify-between p-3 bg-base-200 rounded-lg"
            >
              <div>
                <h3 class="font-medium">{{ category.name }}</h3>
                <p class="text-sm text-base-content/70">
                  {{ category.articleCount }} 篇文章
                </p>
              </div>
              <div class="space-x-2">
                <button
                  class="btn btn-sm btn-ghost"
                  @click="editCategory(category)"
                >
                  编辑
                </button>
                <button
                  class="btn btn-sm btn-error"
                  @click="deleteCategory(category)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分类编辑表单 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">
            {{ isEditing ? '编辑分类' : '新建分类' }}
          </h2>
          
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">分类名称</span>
              </label>
              <input
                v-model="currentCategory.name"
                type="text"
                placeholder="输入分类名称"
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">描述</span>
              </label>
              <textarea
                v-model="currentCategory.description"
                class="textarea textarea-bordered h-24"
                placeholder="输入分类描述"
              ></textarea>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">父级分类</span>
              </label>
              <select v-model="currentCategory.parentId" class="select select-bordered w-full">
                <option value="">无父级分类</option>
                <option
                  v-for="category in parentCategories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">是否显示</span>
                <input
                  v-model="currentCategory.isVisible"
                  type="checkbox"
                  class="checkbox"
                />
              </label>
            </div>

            <div class="flex justify-end space-x-2">
              <button
                type="button"
                class="btn"
                @click="resetForm"
              >
                取消
              </button>
              <button type="submit" class="btn btn-primary">
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Category {
  id: number
  name: string
  description?: string
  parentId?: number
  isVisible: boolean
  articleCount: number
}

// 模拟数据
const categories = ref<Category[]>([
  {
    id: 1,
    name: '技术',
    description: '技术相关文章',
    isVisible: true,
    articleCount: 10
  },
  {
    id: 2,
    name: '设计',
    description: '设计相关文章',
    isVisible: true,
    articleCount: 5
  }
])

// 用于选择父级分类的列表（排除当前编辑的分类）
const parentCategories = computed(() => {
  return categories.value.filter(c => c.id !== currentCategory.value.id)
})

// 当前编辑的分类
const currentCategory = ref<Partial<Category>>({
  name: '',
  description: '',
  parentId: undefined,
  isVisible: true
})

const isEditing = ref(false)

// 创建分类
const createCategory = () => {
  isEditing.value = false
  resetForm()
}

// 编辑分类
const editCategory = (category: Category) => {
  isEditing.value = true
  currentCategory.value = { ...category }
}

// 删除分类
const deleteCategory = (category: Category) => {
  // TODO: 添加删除确认
  categories.value = categories.value.filter(c => c.id !== category.id)
}

// 保存分类
const saveCategory = () => {
  if (isEditing.value) {
    const index = categories.value.findIndex(c => c.id === currentCategory.value.id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...currentCategory.value } as Category
    }
  } else {
    const newCategory = {
      ...currentCategory.value,
      id: Math.max(0, ...categories.value.map(c => c.id)) + 1,
      articleCount: 0
    } as Category
    categories.value.push(newCategory)
  }
  resetForm()
}

// 重置表单
const resetForm = () => {
  currentCategory.value = {
    name: '',
    description: '',
    parentId: undefined,
    isVisible: true
  }
  isEditing.value = false
}
</script>
