import React from 'preact/compat'
import folders, { addFolder, loadFolders } from '../lib/folders'
import Add from '../svgs/Add'
import styles from './Nav.module.css'
import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

function Nav() {
  const [showNew, setShowNew] = React.useState(false)
  const [folderName, setFolderName] = React.useState('')
  const navigate = useNavigate()

  function handleBlur() {
    const name = folderName.trim()
    if (!name) {
      setShowNew(false)
      return
    }

    addFolder({ name })
    setShowNew(false)
    navigate(name)
  }

  React.useEffect(() => {
    loadFolders()
  }, [])

  const sorted = [...folders.value].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <nav>
      <header className="d-flex justify-content-between align-items-center mb-2">
        <span className={styles.title}>Folders</span>

        <div>
          <button className={styles.add} onClick={() => setShowNew(true)}>
            <Add width="18" />
          </button>
        </div>
      </header>

      <ul className="ms-2">
        {showNew && (
          <input
            placeholder="Folder name"
            onBlur={handleBlur}
            onChange={(e) =>
              setFolderName((e.target as HTMLInputElement).value)
            }
          />
        )}

        {sorted.map((folder) => (
          <li key={folder.name}>
            <NavLink
              className={({ isActive }: { isActive: boolean }) =>
                clsx({ [styles.active]: isActive })
              }
              to={folder.name}
            >
              {folder.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
