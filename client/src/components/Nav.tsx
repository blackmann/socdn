import React from 'preact/compat'
import folders, { loadFolders } from '../lib/folders'
import Add from '../svgs/Add'
import styles from './Nav.module.css'
import { Link } from 'react-router-dom'

function Nav() {
  React.useEffect(() => {
    loadFolders()
  }, [])

  return (
    <nav>
      <header className="d-flex justify-content-between align-items-center mb-2">
        <span className={styles.title}>Folders</span>

        <div>
          <button className={styles.add}>
            <Add width="18" />
          </button>
        </div>
      </header>

      <ul className="ms-2">
        {folders.value.map((folder) => (
          <li key={folder.name}>
            <Link to={folder.name}>{folder.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
