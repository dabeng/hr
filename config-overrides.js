const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require("zlib");

module.exports = function override(config, env) {
  config.plugins = config.plugins.concat([
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240, // Only assets bigger than this size are processed (in bytes)
      minRatio: 0.8, // Only assets that compress better than this ratio are processed (minRatio = Compressed Size / Original Size)
    }),
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
  ]);

  return config;
};