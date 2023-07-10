import clsx from 'clsx'
import styles from './FileItem.module.css'
import { F } from '../lib/files'
import { Link } from 'react-router-dom'
import humanSize from '../lib/human-size'
import CopyLink from './CopyLink'
import getFileUrl from '../lib/file-url'

interface Props {
  file: F
}

function FileItem({ file }: Props) {
  const url = getFileUrl(file)

  return (
    <div className={styles.fileItem}>
      <div className="d-flex py-2 px-2">
        <Link to={file._id} className={styles.filename}>
          {file.name}
        </Link>

        <span className={clsx('text-secondary', styles.fileSize)}>
          {humanSize(file.size)}
        </span>

        <span className={styles.date}>3/11/2023</span>
        <span className={styles.action}>
          <CopyLink link={url} />
        </span>
      </div>
    </div>
  )
}

export default FileItem
