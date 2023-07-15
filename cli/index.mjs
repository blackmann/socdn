#!/usr/bin/env node
import meow from 'meow'
import fs from 'fs'
import axios from 'axios'
import path from 'path'
import crypto from 'crypto'
import { FormData } from 'formdata-node'
import { fileFromPath } from 'formdata-node/file-from-path'
import husky from 'husky'

const EMPTY_CONFIG = {
  assetDirectories: [],
  server: 'http://localhost:3000',
}

const destination = path.join(path.resolve('.'), 'sync.meta.json')
const config = JSON.parse(fs.readFileSync(destination, { encoding: 'utf-8' }))

function init() {
  if (!fs.existsSync(destination)) {
    fs.writeFileSync(destination, JSON.stringify(EMPTY_CONFIG, null, 2), {
      encoding: 'utf-8',
    })

    console.log('✅ Please edit `sync.meta.json` with correct values.')
    console.warn('   Do not `add sync.meta.json` to .gitignore.')
  }

  husky.install()
  husky.add('.husky/pre-commit', 'npx socdn sync')
  husky.add('.husky/post-merge', 'npx socdn sync --download')
}

async function sync(download) {
  if (download) {
    await syncDown()
    return
  }

  await syncUp()
}

async function syncDown() {
  if (!config.versions) return

  const assetDirectoryIndex = {}

  for (const dir of config.assetDirectories) {
    const entry = parseDir(dir)
    assetDirectoryIndex[entry.path] = entry
  }

  for (const [dir, versions] of Object.entries(config.versions)) {
    for (const version of versions) {
      const filePath = path.join(path.resolve(dir), version.filename)

      try {
        const file = fs.readFileSync(filePath)
        const hash = md5(file)

        if (hash === version.md5) {
          console.log('s:', dir, version.filename)
          continue
        }
      } catch (err) {
        //
      }

      // file doesn't exist or md5 mismatches, download
      const dirEntry = assetDirectoryIndex[dir]

      const fileUrl = [
        config.server,
        '_',
        dirEntry.remoteFolder,
        version.filename,
      ].join('/')
      const revisionQuery = '?revision=' + version.revision

      const { data } = await axios.get(fileUrl + revisionQuery, {
        responseType: 'stream',
      })

      data.pipe(fs.createWriteStream(filePath))
      console.log('d:', dir, version.filename)
    }
  }
}

async function syncUp() {
  // each entry can be a string or `{path, remoteFolder}` object
  for (const assetDir of config.assetDirectories) {
    const { path: dir, remoteFolder } = parseDir(assetDir)

    // [] each file version is in the format
    // { filename: <string>, md5: <string>, revision: <number> }
    const versions = config['versions']?.[dir] || []

    const fileIndex = Object.fromEntries(
      versions.map((version) => [version.filename, version])
    )

    const newVersions = []

    let files
    try {
      files = fs.readdirSync(path.resolve(dir), { withFileTypes: true })
    } catch (err) {
      // file doesn't exist
      continue
    }

    for (const ent of files) {
      // TODO: Handle nested dirs
      if (ent.isDirectory()) continue

      const filePath = path.join(path.resolve(dir), ent.name)
      const buf = fs.readFileSync(filePath)
      const sum = md5(buf)

      const existing = fileIndex[ent.name]
      let revision = 1
      if (!existing || sum != existing.md5) {
        const formData = new FormData()
        formData.append('files', await fileFromPath(filePath))
        formData.append('hashes', JSON.stringify([sum]))

        const {
          data: [{ revision: uploadRevision }],
        } = await axios.post(
          config.server + '/files?folder=' + remoteFolder,
          formData
        )

        console.log('u:', dir, ent.name)

        revision = uploadRevision.version
      } else {
        console.log('s:', dir, '/', ent.name)
      }

      newVersions.push({ filename: ent.name, md5: sum, revision })
    }

    if (!config.versions) {
      config.versions = {}
    }

    config.versions[dir] = newVersions
  }

  fs.writeFileSync(destination, JSON.stringify(config, null, 2))
}

function parseDir(dir) {
  return typeof dir === 'object' ? dir : { path: dir, remoteFolder: 'general' }
}

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex')
}

// App
// --------

const cli = meow(
  `socdn CLI

Usage
  $ sodcn.js <command>|<flags>

Commands

  init          Creates a config file you edit with correct values and adds relevant git hooks
  sync          Syncs your assets

Flags

  --help        Get this help
  --download    When specified, will download files indicated in sync.meta.json. Else will upload.
`,
  {
    importMeta: import.meta,
    flags: {
      download: { type: 'boolean' },
    },
  }
)

const [command] = cli.input

switch (command) {
  case 'init': {
    init()
    break
  }

  case 'sync': {
    sync(cli.flags.download)
    break
  }

  default: {
    cli.showHelp()
  }
}
