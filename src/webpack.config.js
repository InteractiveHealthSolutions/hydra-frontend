module.exports = {
    module: {
      rules: [
        {
          test: /\.(js|jsx|css)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    }
  };