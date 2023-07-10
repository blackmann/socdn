import React from 'preact/compat'
import { useParams } from 'react-router-dom'
import fileIndex, { loadFile } from '../lib/file-index'
import humanDate from '../lib/human-date'
import humanTime from '../lib/human-time'
import Tag from './Tag'
import humanSize from '../lib/human-size'
import CopyLink from './CopyLink'
import getFileUrl from '../lib/file-url'

function FileDetail() {
  const { fileId } = useParams()

  React.useEffect(() => {
    loadFile(fileId!)
  }, [fileId])

  const data = fileIndex.value[fileId!]

  if (!data) {
    return <>Loading file...</>
  }

  const { file, revisions } = data

  return (
    <>
      <header>
        <h1 className="my-0">{file.name}</h1>
        <div>
          <span className="text-secondary">
            {humanDate(file.created_at)} {humanTime(file.created_at)}
          </span>
          <Tag className="mx-3 text-reset">{humanSize(file.size)}</Tag>

          <CopyLink link={getFileUrl(file)} />
        </div>

        <h4>Revisions</h4>

        <table>
          <tbody>
            {revisions.map((revision) => (
              <tr key={revision._id}>
                <td className="text-secondary">{revision.version}</td>
                <td>
                  {humanDate(revision.created_at)} at{' '}
                  {humanTime(revision.created_at)}
                </td>
                <td>
                  <Tag>{humanSize(revision.size)}</Tag>
                </td>
                <td>
                  <CopyLink link={getFileUrl(file, revision.version)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </>
  )
}

export default FileDetail
