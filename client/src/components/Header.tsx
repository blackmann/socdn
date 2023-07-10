import styles from './Header.module.css'
import Tag from './Tag'

function Header() {
  return (
    <header className={styles.header}>
      socdn <span className="text-primary">/ notgr</span>{' '}
      <Tag>{import.meta.env.DEV ? 'dev' : 'live'}</Tag>
    </header>
  )
}

export default Header
