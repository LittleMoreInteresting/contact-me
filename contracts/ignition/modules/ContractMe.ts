import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CMModule = buildModule("ContractMeModule", (m) => {

  const CM = m.contract("ContractMe");

  return { CM };
});

export default CMModule;
