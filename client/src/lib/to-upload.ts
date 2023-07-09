import { signal } from '@preact/signals'

const toUpload = signal<File[]>([])

function addFiles(...files: File[]) {
  toUpload.value = [...toUpload.value, ...files]
}

function removeFile(file: File) {
  toUpload.value = toUpload.value.filter((f) => f !== file)
}

function clearFiles() {
  toUpload.value = []
}

export default toUpload
export { addFiles, removeFile, clearFiles }
