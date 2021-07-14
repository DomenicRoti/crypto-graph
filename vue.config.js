module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_variables.scss";
        `,
      },
    },
  },

  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {}
  }
};
