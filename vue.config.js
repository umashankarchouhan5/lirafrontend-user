const configureWebpack = require('./webpack.config');

module.exports = {
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    configureWebpack
};
