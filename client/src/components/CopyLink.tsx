import React from 'preact/compat'

interface Props extends React.PropsWithChildren {
  link: string
}

function CopyLink({ children, link }: Props) {
  const [copied, setCopied] = React.useState(false)

  function copy() {
    if (copied) return

    navigator?.clipboard?.writeText(link)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2_000)
  }

  return (
    <button onClick={copy}>
      {copied ? 'Copied' : children || 'Copy link'}
    </button>
  )
}

export default CopyLink
