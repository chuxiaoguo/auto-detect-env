import sh from 'shelljs'
import watch from 'node-watch'

const runCode = (filePath = '') => {
  console.log(`File ${filePath} changed.`)
  sh.exec('npm run build')
  sh.exec('node dist/index.js')
}

watch('./src', { delay: 800 }, (event, filePath) => {
  if (filePath.endsWith('.ts')) {
    runCode(filePath)
  }
})
runCode()
