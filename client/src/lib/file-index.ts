import { signal } from '@preact/signals'
import { F } from './files'
import req from './requests'

interface Revision {
  _id: number
  version: number
  created_at: string
  size: number
}

interface FileData {
  file: F,
  revisions: Revision[]
}

const fileIndex = signal<Record<string, FileData>>({})

async function loadFile(id: string) {
  const { data } = await req.get('/files/' + id)
  index(data)
}

function index(file: FileData) {
  fileIndex.value = { ...fileIndex.value, [file.file._id]: file }
}

export default fileIndex
export { index, loadFile }
