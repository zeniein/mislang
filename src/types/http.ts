// 请求配置
export interface RequestConfig {
  // 是否显示加载中
  showLoading?: boolean
  // 是否显示错误信息
  showError?: boolean
  // 自定义错误信息
  errorMessage?: string
  // 请求头
  headers?: Record<string, string>
  // 超时时间
  timeout?: number
}

// 响应数据接口
export interface ResponseData<T = any> {
  code: number
  data: T
  message: string
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
  [key: string]: any
}

// 分页响应数据
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
