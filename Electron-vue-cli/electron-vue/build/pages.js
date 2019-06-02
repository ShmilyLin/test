var pagesConfig = {
    welcome: {
        name: "welcome",
        title: "欢迎使用“旅行计划”",
        // template: "",
    }
}

var pages = {};
var pagesKeys = Object.keys(pagesConfig);
pagesKeys.forEach(key => {
    const { 
        name, 
        title, 
        template
    } = pagesConfig[key];

    pages[key] = {
        // page 的入口
        entry: `src/pages/${name ? name : key}/main.js`,
        // 模板来源
        template: template ? template : 'public/index.html',
        // 在 dist/index.html 的输出
        filename: `${name ? name : key}.html`,
        title: title ? title : (name ? name : key),
        chunks: ['chunk-vendors', 'chunk-common', (name ? name : key)]
    }
}) 

module.exports = pages;