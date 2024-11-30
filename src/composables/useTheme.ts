import { ref, watchEffect } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  // 初始化主题
  const initTheme = () => {
    const theme = document.documentElement.getAttribute('data-theme')
    isDark.value = theme === 'dark'
  }

  // 监听主题变化
  watchEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const theme = document.documentElement.getAttribute('data-theme')
          isDark.value = theme === 'dark'
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    // 初始化当前主题
    initTheme()

    // 清理观察器
    return () => observer.disconnect()
  })

  return {
    isDark
  }
}
