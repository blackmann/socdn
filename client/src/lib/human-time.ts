
function humanTime(date: string | Date) {
  const d = new Date(date)

  return `${d.getHours()}:${d.getMinutes()}`
}

export default humanTime
