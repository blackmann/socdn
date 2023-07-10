import clsx from 'clsx'
import styles from './Tag.module.css'

interface Props extends React.PropsWithChildren {
  className?: string
}
function Tag({ children, className }: Props) {
  return <span className={clsx(styles.tag, className)}>{children}</span>
}

export default Tag
