

function f(s: string | number) {
  return s.toString().padStart(2, '0')
}

function humanDate(date: string | Date) {
  const d = new Date(date)

  return `${f(d.getDate())}/${f(d.getMonth() + 1)}/${d.getFullYear()}`
}

export default humanDate
