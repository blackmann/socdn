import Files from './components/Files'
import Header from './components/Header'
import Nav from './components/Nav'
import { addFiles } from './lib/to-upload'

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const files = event.dataTransfer?.files || []
  addFiles(...files)
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
          <Files />
        </div>
      </div>
    </div>
  )
}
