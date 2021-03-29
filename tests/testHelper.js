// Require this at the top of every test file to use aliases

require("../src/config");

require("module-alias").addAliases({
  "@helpers": `${__dirname}/helpers`,
});
