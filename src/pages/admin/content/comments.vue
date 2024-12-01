<template>
  <div class="container mx-auto px-4 py-4 max-w-7xl space-y-4">
    <!-- 头部标题和搜索栏 -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h1 class="text-2xl font-bold">评论管理</h1>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <div class="form-control flex-1 md:flex-none md:w-64">
          <input type="text" v-model="searchQuery" placeholder="搜索评论内容..." class="input input-bordered w-full" />
        </div>
        <select v-model="filterStatus" class="select select-bordered">
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="card bg-base-100">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="w-14">
                  <label>
                    <input type="checkbox" class="checkbox" v-model="selectAll" @change="handleSelectAll" />
                  </label>
                </th>
                <th>评论内容</th>
                <th>文章</th>
                <th>评论者</th>
                <th>状态</th>
                <th>时间</th>
                <th class="w-32">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="comment in comments" :key="comment.id" class="hover">
                <td>
                  <label>
                    <input type="checkbox" class="checkbox" v-model="selectedComments" :value="comment.id" />
                  </label>
                </td>
                <td class="max-w-md">
                  <div class="line-clamp-2">{{ comment.content }}</div>
                </td>
                <td>
                  <a :href="'/article/' + comment.articleId" target="_blank" class="link link-hover">
                    {{ comment.articleTitle }}
                  </a>
                </td>
                <td>
                  <div class="flex items-center space-x-2">
                    <div class="avatar">
                      <div class="w-8 h-8 rounded-full">
                        <img :src="comment.userAvatar" :alt="comment.userName" />
                      </div>
                    </div>
                    <div>{{ comment.userName }}</div>
                  </div>
                </td>
                <td>
                  <div class="badge" :class="{
                    'badge-warning': comment.status === 'pending',
                    'badge-success': comment.status === 'approved',
                    'badge-error': comment.status === 'rejected'
                  }">
                    {{ getStatusText(comment.status) }}
                  </div>
                </td>
                <td>{{ formatDate(comment.createdAt) }}</td>
                <td>
                  <div class="flex items-center space-x-2">
                    <button 
                      v-if="comment.status === 'pending'"
                      class="btn btn-ghost btn-sm" 
                      @click="handleApprove(comment.id)"
                    >
                      通过
                    </button>
                    <button 
                      v-if="comment.status === 'pending'"
                      class="btn btn-ghost btn-sm text-error" 
                      @click="handleReject(comment.id)"
                    >
                      拒绝
                    </button>
                    <button 
                      class="btn btn-ghost btn-sm"
                      @click="handleReply(comment)"
                    >
                      回复
                    </button>
                    <button 
                      class="btn btn-ghost btn-sm text-error"
                      @click="handleDelete(comment.id)"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-base-content/70">
        共 {{ total }} 条评论
      </div>
      <div class="join">
        <button 
          class="join-item btn btn-sm" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>
        <button class="join-item btn btn-sm">{{ currentPage }}/{{ totalPages }}</button>
        <button 
          class="join-item btn btn-sm" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 回复对话框 -->
    <dialog ref="replyDialog" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-lg mb-4">回复评论</h3>
        <div class="space-y-4">
          <div class="bg-base-200 p-4 rounded-lg">
            <div class="text-sm text-base-content/70 mb-2">原评论：</div>
            <div>{{ selectedComment?.content }}</div>
          </div>
          <div class="form-control">
            <textarea 
              v-model="replyContent" 
              class="textarea textarea-bordered h-24" 
              placeholder="请输入回复内容..."
            ></textarea>
          </div>
        </div>
        <div class="modal-action">
          <button class="btn btn-ghost">取消</button>
          <button class="btn btn-primary" @click="handleSubmitReply">回复</button>
        </div>
      </form>
      <form method="dialog" class="modal-backdrop">
        <button>关闭</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatDate } from '@/utils/date'

// 状态和筛选
const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 选择状态
const selectAll = ref(false)
const selectedComments = ref<string[]>([])

// 回复对话框
const replyDialog = ref<HTMLDialogElement>()
const replyContent = ref('')
const selectedComment = ref<any>(null)

// 模拟数据
const comments = ref([
  {
    id: '1',
    content: '这是一条测试评论，内容很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
    articleId: '1',
    articleTitle: '测试文章标题',
    userName: '测试用户',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  // ... 更多测试数据
])

// 计算属性
const total = computed(() => comments.value.length)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 方法
function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

function handleSelectAll() {
  if (selectAll.value) {
    selectedComments.value = comments.value.map(comment => comment.id)
  } else {
    selectedComments.value = []
  }
}

function handleApprove(id: string) {
  // TODO: 实现审核通过逻辑
  console.log('approve', id)
}

function handleReject(id: string) {
  // TODO: 实现拒绝逻辑
  console.log('reject', id)
}

function handleReply(comment: any) {
  selectedComment.value = comment
  replyContent.value = ''
  replyDialog.value?.showModal()
}

function handleSubmitReply() {
  if (!replyContent.value.trim()) return
  // TODO: 实现回复逻辑
  console.log('reply', {
    commentId: selectedComment.value?.id,
    content: replyContent.value
  })
  replyDialog.value?.close()
}

function handleDelete(id: string) {
  // TODO: 实现删除逻辑
  console.log('delete', id)
}
</script>
