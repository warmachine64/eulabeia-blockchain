var NFTCollection = artifacts.require("./NFTCollection.sol");
var Migrations = artifacts.require("./Migrations.sol");
var Adoption = artifacts.require("./Adoption.sol");


module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(NFTCollection,"http://localhost:8080/ipfs/QmYCwjbzaj53ZMz4cysXLKXdH4nBT4GAEg61NefN4uRnUg","TOKEN NAME","SYMBOL");
  deployer.deploy(Adoption);

};
