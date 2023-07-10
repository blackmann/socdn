
function humanSize(size: number) {
  if (size < 1_000) {
    return size + 'b'
  }

  if (size < 1_000_000) {
    return (size / 1_000).toFixed(2) + 'Kb'
  }

  if (size < 1_000_000_000) {
    return (size / 1_000_000).toFixed(2) + 'Mb'
  }

  return (size / 1_000_000_000).toFixed(2) + 'Gb'
}

export default humanSize