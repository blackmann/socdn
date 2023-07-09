import { signal } from '@preact/signals'
import req from './requests'

interface Folder {
  name: string
}

const folders = signal<Folder[]>([])

async function loadFolders() {
  const { data } = await req.get('/folders')

  folders.value = data.sort((a: Folder, b: Folder) => a.name.localeCompare(b.name))
}

function addFolder(folder: Folder) {
  folders.value = [...folders.value, folder].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

export default folders
export { loadFolders, addFolder }
