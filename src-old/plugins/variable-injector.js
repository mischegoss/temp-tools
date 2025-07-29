const visit = require('unist-util-visit');

const plugin = (options) => {
  const transformer = async (ast) => {
    visit(ast, 'text', (node) => {
      // Replace all occurrences of ^varName with the value of varName
      node.value = node.value.replace(/VAR::([A-Z_]+)/g, (match, varName) => {
        return options.replacements[varName] || match;
      });
    });
  };
  return transformer;
};

module.exports = plugin;