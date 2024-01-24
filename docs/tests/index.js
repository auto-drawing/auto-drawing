const fs = require('fs')
const path = require('path')
const data = require('./data.json')
console.log(data)

const res = data.map(item => {
  const { params, ...temp } = item

  if (temp.data) {
    const d = temp.data.map(item => {
      const { params, ...temp } = item
      return { ...temp }
    })

    temp.data = d
  }

  return { ...temp }
})

fs.writeFileSync(path.join(__dirname, 'res.json'), JSON.stringify(res, null, 2))
