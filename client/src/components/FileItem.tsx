import clsx from 'clsx'
import styles from './FileItem.module.css'

function FileItem() {
  return (
    <div className={styles.fileItem}>
      <div className="d-flex py-2 px-2">
        <a href="/" className={styles.filename}>
          garage.blend
        </a>

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
