const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const Apps = [{
    name: "Welcome",
    // filename: "welcome",
    path: "pages/Welcome",
    // template: "",
},{
    name: "Plan",
    path: "pages/Plan",
}]

function GetApps(webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    const appDirectory = fs.realpathSync(process.cwd());
    const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

    const Entry = {};
    const Plugins = [];
    Apps.forEach((value, index) => {
        if (!value.filename) {
            value.filename = value.name.toLowerCase();
        }
        Entry[value.filename] = [
            // require.resolve('./polyfills'),
            isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
            value.path ? resolveApp('src/' + value.path + '/index.js') : resolveApp('src/pages/' + value.name + '/index.js'),
        ].filter(Boolean);

        Plugins.push(new HtmlWebpackPlugin(Object.assign(
            {},
            {
                inject: true,
                chunks:[value.filename],
                template: value.template ? value.template : resolveApp('public/index.html'),
                filename: value.filename + '.html',
            },
            isEnvProduction
              ? {
                  minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                  },
                }
              : undefined
        )));
    })

    return {
        Entry,
        Plugins
    }
}


module.exports = GetApps;