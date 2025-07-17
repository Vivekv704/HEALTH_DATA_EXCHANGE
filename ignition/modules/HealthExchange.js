// ignition/modules/HealthExchange.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("HealthExchangeModule", (m) => {
  const healthExchange = m.contract("HealthExchange");
  return { healthExchange };
}); 