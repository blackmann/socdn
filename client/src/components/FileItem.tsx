import clsx from 'clsx'
import styles from './FileItem.module.css'
import { F } from '../lib/files'
import { Link } from 'react-router-dom'

interface Props {
  file: F
}

function FileItem({ file }: Props) {
  return (
    <div className={styles.fileItem}>
      <div className="d-flex py-2 px-2">
        <Link to={file.name} className={styles.filename}>
          {file.name}
        </Link>

        <span className={clsx('text-secondary', styles.fileSize)}>23Mb</span>

        <span className={styles.date}>3/11/2023</span>
        <span className={styles.action}>
          <button>Copy URL</button>
        </span>
      </div>
    </div>
  )
}

export default FileItem
