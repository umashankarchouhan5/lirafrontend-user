const path = require("path");

module.exports = {
    resolve: {
        alias: {
            Components: path.resolve(__dirname, "src/components"),
            Atoms: path.resolve(__dirname, "src/components/atoms"),
            Molecules: path.resolve(__dirname, "src/components/molecules"),
            Organisms: path.resolve(__dirname, "src/components/organisms"),
            Assets: path.resolve(__dirname, "src/assets"),
            Utils: path.resolve(__dirname, "src/utils"),
            Mixins: path.resolve(__dirname, "src/mixins"),
            Pages: path.resolve(__dirname, "src/pages"),
            Styles: path.resolve(__dirname, "src/styles"),
            Config: path.resolve(__dirname, "src/config")
        }
    },
};
