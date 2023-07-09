import { signal } from '@preact/signals'
import req from './requests'

interface F {
  _id: string
  name: string
}
type FolderName = string

const files = signal<Record<FolderName, F[]>>({})

async function getFiles(folder: FolderName) {
  const { data } = await req.get('/files?folder=' + folder)
  files.value = { ...files, [folder]: data }
}

export default files
export { getFiles }

export type { F }
