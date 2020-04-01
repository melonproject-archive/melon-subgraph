import { BigInt } from "@graphprotocol/graph-ts";
import { Investor, InvestorCount } from "../codegen/schema";
import { currentState } from "../utils/currentState";

export function investorEntity(address: string, createdAt: BigInt): Investor {
  let id = address;
  let investor = Investor.load(id);

  if (!investor) {
    investor = new Investor(id);
    investor.createdAt = createdAt;
    investor.investments = [];
    investor.active = false;
    investor.save();

    // update number of investors
    let state = currentState();
    let activeInvestors = state.activeInvestors.plus(BigInt.fromI32(1));
    let nonActiveInvestors = state.nonActiveInvestors;
    let investorCount = new InvestorCount(createdAt.toString());
    investorCount.active = activeInvestors;
    investorCount.nonActive = nonActiveInvestors;
    investorCount.timestamp = createdAt;
    investorCount.save();

    // update state
    state.activeInvestors = activeInvestors;
    state.save();
  }

  return investor as Investor;
}
