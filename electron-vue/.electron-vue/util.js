const path = require('path')
const glob = require('glob')

// 入口文件所在文件夹为 renderer/pages
function getPagesConfig(pagesPath = path.resolve(__dirname, '../src/renderer/pages/**?')) {
  let entries = {}
  let plugins = []
  glob.sync(pagesPath).forEach(entry => {
      console.log("util entry", entry);
    let basename = path.basename(entry, path.extname(entry))
    console.log("util basename", basename);
    entries[basename] = path.join(entry, 'main.js')
    console.log("util entries", entries);
    plugins.push({
      title: basename,
      filename: basename + '.html',
      chunks: [basename]
    })
  })
  return { entries, plugins }
}

module.exports = {
  getPagesConfig
}