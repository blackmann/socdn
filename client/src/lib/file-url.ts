import { F } from "./files";

function getFileUrl(file: F, revision?: number) {
  const parts = [import.meta.env.API_URL + '/_/' + file._id]
  if (revision) {
    parts.push('revision=' + revision)
  }

  return parts.join('?')
}

export default getFileUrl
