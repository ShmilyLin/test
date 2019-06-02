const PagesConfig = require('./build/pages.js');

module.exports = {
    publicPath: './',
    pages: PagesConfig,
    productionSourceMap: false, 
    // configureWebpack: config => {
    //     console.log("configureWebpack", config.externals);
    //     // Deleting default entry
    //     // delete config.entry.app

    //     config.externals = {
    //         'electron': 'electron'
    //     }
    // }
    // chainWebpack: config => {
    //     console.log("chainWebpack", config.entryPoints);
    // }
}