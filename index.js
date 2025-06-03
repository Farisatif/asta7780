console.clear()
console.log('Zeref')

import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import { createInterface } from 'readline'
import yargs from 'yargs'
import { EventEmitter } from 'events'
import dns from 'dns'

EventEmitter.defaultMaxListeners = 20 // حل مشكلة MaxListenersExceeded

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

const { name, author } = require(join(__dirname, './package.json'))
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

say('Zeref', {
  font: 'block',
  align: 'center',
  colors: ['cyan', 'red']
})

say('ASTA', {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']
})

let isRunning = false

// دالة لفحص اتصال الانترنت عبر محاولة التحقق من dns جوجل
function checkInternet(cb) {
  dns.lookup('google.com', (err) => {
    if (err && err.code == "ENOTFOUND") {
      cb(false)
    } else {
      cb(true)
    }
  })
}

/**
 * Start a js file
  * @param {String} file `path/to/file`
   */
function start(file) {
  if (isRunning) return
  isRunning = true
  let args = [join(__dirname, file), ...process.argv.slice(2)]

  setupMaster({
    exec: args[0],
    args: args.slice(1)
  })

  let p = fork()

  p.on('message', data => {
    console.log('[RECEIVED]', data)
    switch (data) {
      case 'reset':
        p.process.kill()
        isRunning = false
        start.apply(this, arguments)
        break
      case 'uptime':
        p.send(process.uptime())
        break
    }
  })

  p.on('exit', (_, code) => {
    isRunning = false
    console.error('❎ㅤerorr:', code)

    p.process.kill()
    isRunning = false
    start.apply(this, arguments)

    if (process.env.pm_id) {
      process.exit(1)
    } else {
      process.exit()
    }
  })

  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
  if (!opts['test']) {
    if (!rl.listenerCount('line')) {
      rl.on('line', line => {
        p.emit('message', line.trim())
      })
    }
  }
}

// دالة لإعادة محاولة تشغيل البوت فقط إذا كان النت شغال
function startWithInternetCheck() {
  checkInternet((isConnected) => {
    if (isConnected) {
      console.log('✅ الإنترنت متصل، جاري تشغيل البوت...')
      start('main.js')
    } else {
      console.log('❌ لا يوجد اتصال بالإنترنت، سيتم إعادة المحاولة بعد 5 ثواني...')
      setTimeout(startWithInternetCheck, 5000)
    }
  })
}
process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)
startWithInternetCheck()