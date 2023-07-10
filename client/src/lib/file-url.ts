import { ENDPOINT } from "./requests"

function getFileUrl(folder: string, file: string, revision?: number) {
  const parts = [ENDPOINT + '/_/' + folder + '/' + file]
  if (revision) {
    parts.push('revision=' + revision)
  }

  return parts.join('?')
}

export default getFileUrl
