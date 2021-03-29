// Require this file in every test to use aliases and to have access to environment variables

const moduleAlias = require("module-alias");

moduleAlias.addAliases({
  "@root": `${__dirname}/../src`,
  "@helpers": `${__dirname}/helpers`,
});

require("@root/config");
