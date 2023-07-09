import Add from '../svgs/Add'
import styles from './Nav.module.css'

function Nav() {
  return (
    <nav>
      <header className="d-flex justify-content-between align-items-center mb-2">
        <span className={styles.title}>Folders</span>

        <div>
          <button className={styles.add}>
            <Add width='18'/>
          </button>
        </div>
      </header>

      <ul className="ms-2">
        <li><a href="/">blends</a></li>
        <li><a href="/">blog_videos</a></li>
      </ul>
    </nav>
  )
}

export default Nav
