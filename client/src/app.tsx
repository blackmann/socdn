import { Route, Routes } from 'react-router-dom'
import Files from './components/Files'
import Header from './components/Header'
import Nav from './components/Nav'
import { addFiles } from './lib/to-upload'
import Folder from './svgs/Folder'
import folders from './lib/folders'
import FileDetail from './components/FileDetail'

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const files = event.dataTransfer?.files || []
  addFiles(...files)
}

function Empty() {
  const hasFolders = folders.value.length

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-secondary py-5">
      <Folder />
      <div className="mt-3">
        {hasFolders ? 'Select a folder' : 'Create a folder'} to get started
      </div>
    </div>
  )
}

export function App() {
  return (
    <div
      className="container"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Header />

      <div className="row">
        <div className="col-md-3">
          <Nav />
        </div>

        <div className="col-md-7">
          <Routes>
            <Route element={<Files />} path=":folder" />
            <Route element={<FileDetail />} path=":folder/:fileId" />
            <Route element={<Empty />} path="" />
          </Routes>
        </div>
      </div>
    </div>
  )
}
