var pagesConfig = {
    welcome: {
        name: "welcome",
        title: "欢迎使用“旅行计划”",
        // template: "",
    },
    plan: {
        name: "plan",
        title: "新建“旅行计划”",
    },
}

var modalsConfig = {
    CreateHotelCard: {
        name: "CreateHotelCard",
        title: "创建住宿卡",
        path: "modals/CreateHotelCard"
    }
}

var configList = Object.assign({}, pagesConfig, modalsConfig);
var pages = {};
var pagesKeys = Object.keys(configList);
pagesKeys.forEach(key => {
    const { 
        name, 
        title, 
        template,
        path, 
    } = configList[key];

    pages[key] = {
        // page 的入口
        entry: path ? `src/${path}/main.js` : `src/pages/${name ? name : key}/main.js`,
        // 模板来源
        template: template ? template : 'public/index.html',
        // 在 dist/index.html 的输出
        filename: `${name ? name : key}.html`,
        title: title ? title : (name ? name : key),
        chunks: ['chunk-vendors', 'chunk-common', (name ? name : key)]
    }
}) 

module.exports = pages;