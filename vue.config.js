const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.igraider.app',
        productName: 'Instagram Raider',
        compression: 'store',
        win: {
          icon: 'build/icons/icon.ico'
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        }
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/variables.scss";`
      }
    }
  },
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ]
  }
}
