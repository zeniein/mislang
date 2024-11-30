import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import config from '@/config'
import type { RequestConfig, ResponseData } from '@/types/http'

export class Http {
  // axios 实例
  private instance: AxiosInstance
  // 默认配置
  private defaultConfig: RequestConfig = {
    showLoading: true,
    showError: true,
    timeout: config.timeout
  }

  constructor() {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      config => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => {
        // 对请求错误做些什么
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      response => {
        // 对响应数据做点什么
        const res = response.data
        if (res.code !== 0) {
          // 处理业务错误
          if (res.code === 401) {
            // 处理未授权
            localStorage.removeItem('token')
            window.location.href = '/login'
          }
          return Promise.reject(new Error(res.message || 'Error'))
        }
        return res
      },
      error => {
        // 对响应错误做点什么
        console.error('请求错误', error)
        return Promise.reject(error)
      }
    )
  }

  // 发送请求的基础方法
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ResponseData<T>> {
    const finalConfig = { ...this.defaultConfig, ...config }
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      ...finalConfig
    }

    if (method.toLowerCase() === 'get') {
      axiosConfig.params = data
    } else {
      axiosConfig.data = data
    }

    try {
      const response = await this.instance.request<any, ResponseData<T>>(axiosConfig)
      return response
    } catch (error: any) {
      if (finalConfig.showError) {
        // 这里可以集成你的错误提示组件
        console.error(finalConfig.errorMessage || error.message)
      }
      throw error
    }
  }

  // GET 请求
  public async get<T>(url: string, params?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>('get', url, params, config)
  }

  // POST 请求
  public async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>('post', url, data, config)
  }

  // PUT 请求
  public async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>('put', url, data, config)
  }

  // DELETE 请求
  public async delete<T>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ResponseData<T>> {
    return this.request<T>('delete', url, data, config)
  }
}

// 导出实例
export default new Http()
