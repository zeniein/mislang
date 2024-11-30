<template>
  <div ref="editorContainer" class="monaco-container h-full w-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps<{
  modelValue: string
  language?: string
  theme?: string
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let preventTriggerChangeEvent = false

// 配置编辑器选项
const createEditorOptions = (): monaco.editor.IStandaloneEditorConstructionOptions => ({
  value: props.modelValue,
  language: props.language || 'plaintext',
  theme: props.theme || 'vs-dark',
  automaticLayout: false,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  readOnly: props.readOnly,
  fontSize: 14,
  lineNumbers: 'on',
  renderLineHighlight: 'all',
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    useShadows: false,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10
  },
  wordWrap: 'on',
  quickSuggestions: true,
  formatOnType: true,
  formatOnPaste: true,
  tabSize: 2,
  insertSpaces: true,
  detectIndentation: true,
  folding: true,
  glyphMargin: false,
  lightbulb: {
    enabled: true
  }
})

const updateEditorLayout = () => {
  if (editor && editorContainer.value) {
    const { width, height } = editorContainer.value.getBoundingClientRect()
    editor.layout({ 
      width: Math.max(width - 16, 0),  // 减去内边距
      height: Math.max(height - 16, 0)  // 减去内边距
    })
  }
}

const initEditor = async () => {
  if (!editorContainer.value) return

  // 创建编辑器实例
  editor = monaco.editor.create(editorContainer.value, createEditorOptions())

  // 创建新的 model
  const model = monaco.editor.createModel(
    props.modelValue,
    props.language || 'plaintext'
  )
  editor.setModel(model)

  // 监听内容变化
  editor.onDidChangeModelContent(() => {
    if (!editor || preventTriggerChangeEvent) return
    const value = editor.getValue()
    emit('update:modelValue', value)
  })

  // 自适应容器大小
  const resizeObserver = new ResizeObserver(() => {
    updateEditorLayout()
  })
  resizeObserver.observe(editorContainer.value)

  // 确保初始布局正确
  nextTick(() => {
    updateEditorLayout()
  })

  // 清理 observer
  onBeforeUnmount(() => {
    resizeObserver.disconnect()
    if (editor) {
      editor.getModel()?.dispose()
      editor.dispose()
    }
  })
}

onMounted(() => {
  nextTick(() => {
    initEditor()
  })
})

// 监听属性变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (!editor || newValue === editor.getValue()) return
    
    preventTriggerChangeEvent = true
    editor.setValue(newValue)
    preventTriggerChangeEvent = false
  }
)

watch(
  () => props.language,
  (newValue) => {
    if (!editor || !newValue) return
    monaco.editor.setModelLanguage(editor.getModel()!, newValue)
  }
)

watch(
  () => props.theme,
  (newValue) => {
    if (!editor || !newValue) return
    monaco.editor.setTheme(newValue)
  }
)
</script>

<style>
.monaco-container {
  position: relative;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
}

.monaco-container .monaco-editor {
  position: absolute !important;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  height: calc(100% - 16px) !important;
  width: calc(100% - 16px) !important;
  border-radius: 4px;
}

.monaco-editor .overflow-guard {
  border-radius: 4px;
}
</style>
