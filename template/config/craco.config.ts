import { CracoConfig, getPlugin, pluginByName, throwUnexpectedConfigError } from "@craco/craco";
import webpack from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { dependencies } from '../package.json'
import { resolve } from 'path';

const config: CracoConfig = {
  webpack: {
    configure(config, context) {
      config.resolve = {
        ...config.resolve,
        alias: {
          "@": resolve(__dirname, ".", "src")
        }
      }
      config.output = {
        ...config.output,
        publicPath: 'auto'
      }
      const cracoHtmlPluginFinder = getPlugin(config, pluginByName("HtmlWebpackPlugin"))
      if (cracoHtmlPluginFinder.isFound) {
        const htmlPlugin: HtmlWebpackPlugin = cracoHtmlPluginFinder.match
        if (htmlPlugin.options) {
          htmlPlugin.userOptions.publicPath = "/"
        }
      } else {
        throwUnexpectedConfigError({
          message: "Can't find HtmlWebpackPlugin in the webpack config!",
          packageName: "html-webpack-plugin"
        })
      }
      return config
    },
    plugins: {
      add: [
        new webpack.container.ModuleFederationPlugin({
          name: "",
          filename: "remoteEntry.js",
          exposes: {
          },
          remotes: {},
          shared: {
            react: {
              singleton: true,
              requiredVersion: dependencies["react"],
            },
            "react-dom": {
              singleton: true,
              requiredVersion: dependencies["react-dom"],
            },
            "react-router-dom": {
              singleton: true,
              requiredVersion: dependencies["react-router-dom"],
            }
          },
        })
      ]
    }
  }
}

export default config