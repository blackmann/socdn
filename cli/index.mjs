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
}

async function sync() {
  const config = JSON.parse(fs.readFileSync(destination, { encoding: 'utf-8' }))
  // each entry can be a string or `{path, remoteFolder}` object
  for (const assetDir of config.assetDirectories) {
    const { path: dir, remoteFolder } =
      typeof assetDir === 'object'
        ? assetDir
        : { path: assetDir, remoteFolder: 'general' }

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
      const sum = crypto.createHash('md5').update(buf).digest('hex')

      const existing = fileIndex[ent.name]
      let revison = 1
      if (!existing || sum != existing.md5) {
        const formData = new FormData()
        formData.append('files', await fileFromPath(filePath))

        const {
          data: [{ revision: uploadRevision }],
        } = await axios.post(
          config.server + '/files?folder=' + remoteFolder,
          formData
        )

        revison = uploadRevision.version
      }

      newVersions.push({ filename: ent.name, md5: sum, revison })
    }

    if (!config.versions) {
      config.versions = {}
    }

    config.versions[dir] = newVersions
  }

  fs.writeFileSync(destination, JSON.stringify(config, null, 2))
}

const cli = meow(
  `socdn CLI

Usage
  $ sodcn.js <command>|<flags>

Commands

  init          Creates a config file you edit with correct values and adds relevant git hooks
  sync          Syncs your assets

Flags

  --help        Get this help
`,
  {
    importMeta: import.meta
  }
)

const [command] = cli.input

switch (command) {
  case 'init': {
    init()
    break
  }

  case 'sync': {
    sync()
    break
  }

  default: {
    cli.showHelp()
  }
}
