import clsx from 'clsx'
import FileItem from './FileItem'
import styles from './Files.module.css'
import Remove from '../svgs/Remove'
import Upload from '../svgs/Upload'
import toUpload, { clearFiles, removeFile } from '../lib/to-upload'
import React from 'preact/compat'
import { useParams } from 'react-router-dom'
import files, { getFiles } from '../lib/files'
import Tag from './Tag'
import humanSize from '../lib/human-size'

function FilesToUpload() {
  return (
    <div className={clsx('my-3 p-3', styles.uploadPreview)}>
      <header className="mb-3 d-flex align-items-center justify-content-between">
        <span className="text-accent">
          <Upload />
        </span>
        <span className={styles.toUploadTitle}>
          {toUpload.value.length} selected
        </span>
      </header>

      {toUpload.value.map((file) => (
        <div
          className={clsx(
            'py-1 d-flex justify-content-between align-items-center',
            styles.uploadItem
          )}
          key={file.name}
        >
          <span>
            {file.name} <Tag>{humanSize(file.size)}</Tag>
          </span>
          <button
            className={clsx(styles.removeButton, 'text-secondary')}
            onClick={() => removeFile(file)}
            title="Remove"
          >
            <Remove width="18" />
          </button>
        </div>
      ))}

      <footer className="mt-3 d-flex justify-content-end">
        <button onClick={() => clearFiles()}>Cancel</button>
        <button className="primary">Upload all</button>
      </footer>
    </div>
  )
}

function Listing() {
  const { folder } = useParams()
  const folderListing = files.value[folder as string] || []

  React.useEffect(() => {
    getFiles(folder as string)
  }, [folder])

  return (
    <>
      <header className={styles.header}>
        blends/ <Tag>{folderListing.length} &bull; 1.35Gb</Tag>
      </header>
      <div className="text-secondary">Drag files unto page to upload</div>

      {Boolean(toUpload.value.length) && <FilesToUpload />}

      <div className="mt-3">
        {folderListing.map((file) => (
          <FileItem file={file} />
        ))}
      </div>
    </>
  )
}

function Files() {
  const { folder } = useParams()
  return <Listing key={folder} />
}

export default Files
