const fg = require('fast-glob')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

const pathResolve = p => path.join(__dirname, '../', p)

const componentsDir = pathResolve('public/components')

rimraf(componentsDir, {}, () => {
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir)
  }

  fg(['components**/*.vue']).then(entries => {
    entries.forEach(item => {
      const data = fs.readFileSync(pathResolve(item), 'utf-8')

      const p = pathResolve(`./public/${item}.txt`)
      const hasFile = fs.existsSync(p)
      if (!hasFile) {
        fs.writeFileSync(p, data)
      }
    })
  })
})
