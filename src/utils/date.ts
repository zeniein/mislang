import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param formatStr 格式化字符串，默认为 'yyyy-MM-dd HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date | null | undefined, formatStr = 'yyyy-MM-dd HH:mm:ss'): string {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return '-'
    
    return format(dateObj, formatStr, { locale: zhCN })
  } catch (error) {
    console.error('日期格式化错误:', error)
    return '-'
  }
}

/**
 * 格式化为相对时间
 * @param date 日期字符串或Date对象
 * @returns 相对时间字符串，如：5分钟前、2小时前、3天前等
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return '-'
    
    return formatDistanceToNow(dateObj, { 
      addSuffix: true,
      locale: zhCN 
    })
  } catch (error) {
    console.error('相对时间格式化错误:', error)
    return '-'
  }
}

/**
 * 格式化为友好的时间显示
 * 如果是今天，显示具体时间，如：14:30
 * 如果是昨天，显示"昨天 14:30"
 * 如果是前天，显示"前天 14:30"
 * 如果是今年，显示"03-15 14:30"
 * 其他显示完整日期，如："2023-03-15 14:30"
 * @param date 日期字符串或Date对象
 * @returns 友好的时间字符串
 */
export function formatFriendlyTime(date: string | Date | null | undefined): string {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return '-'
    
    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    // 今天
    if (days === 0) {
      return format(dateObj, 'HH:mm', { locale: zhCN })
    }
    // 昨天
    if (days === 1) {
      return `昨天 ${format(dateObj, 'HH:mm', { locale: zhCN })}`
    }
    // 前天
    if (days === 2) {
      return `前天 ${format(dateObj, 'HH:mm', { locale: zhCN })}`
    }
    // 今年
    if (dateObj.getFullYear() === now.getFullYear()) {
      return format(dateObj, 'MM-dd HH:mm', { locale: zhCN })
    }
    // 其他
    return format(dateObj, 'yyyy-MM-dd HH:mm', { locale: zhCN })
  } catch (error) {
    console.error('友好时间格式化错误:', error)
    return '-'
  }
}
