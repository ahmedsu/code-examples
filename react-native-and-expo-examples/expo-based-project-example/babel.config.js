module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@tests": ["./tests/"],
            "@components": "./src/components",
            "@assets": "./src/assets",
            "@theme": "./src/theme",
            "@constants": "./src/constants",
            "@utils": "./src/utils",
            "@languages": "./src/languages",
            "@hooks": "./src/hooks",
            "@navigation": "./src/navigation",
            "@redux": "./src/redux",
            "@screens": "./src/screens",
            "@sockets": "./src/sockets",
            "@types": "./src/types",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
