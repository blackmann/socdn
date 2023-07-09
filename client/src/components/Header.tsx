import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      socdn <span className="text-primary">/ notgr</span>{' '}
      <span className="text-secondary">(3.4gig)</span>
    </header>
  )
}

export default Header
