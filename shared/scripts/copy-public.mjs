// Copies the shared images and the fake chat widget into the app's own public/ folder.
// Each app runs this automatically before `dev` and `build`, so the images live in one place.
import { cpSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = resolve(here, '../public')
const target = resolve(process.cwd(), 'public')

cpSync(source, target, { recursive: true, force: false, errorOnExist: false })
console.log(`Copied shared images and chat-widget.js into ${target}`)
