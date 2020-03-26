import { BigInt, log } from "@graphprotocol/graph-ts";
import { Investment, InvestmentCount } from "../codegen/schema";
import { investorEntity } from "./investorEntity";
import { currentState } from "../utils/currentState";

export function investmentEntity(
  owner: string,
  fund: string,
  createdAt: BigInt,
  newInvestment: boolean = false
): Investment {
  let id = owner + "/" + fund;
  let investment = Investment.load(id);

  if (!investment) {
    let investor = investorEntity(owner, createdAt);

    investment = new Investment(id);
    investment.createdAt = createdAt;
    investment.shares = BigInt.fromI32(0);
    investment.gav = BigInt.fromI32(0);
    investment.nav = BigInt.fromI32(0);
    investment.fund = fund;
    investment.owner = investor.id;
    investment.save();

    // update investor
    investor.investments = investor.investments.concat([id]);
    investor.active = true;
    investor.save();

    // update number of investments
    let state = currentState();
    let allInvestments = state.allInvestments;
    if (newInvestment) {
      allInvestments = allInvestments.plus(BigInt.fromI32(1));
    }

    let activeInvestments = state.activeInvestments.plus(BigInt.fromI32(1));
    let nonActiveInvestments = state.nonActiveInvestments;

    let investmentCount = new InvestmentCount(createdAt.toString());
    investmentCount.all = allInvestments;
    investmentCount.active = activeInvestments;
    investmentCount.nonActive = nonActiveInvestments;
    investmentCount.timestamp = createdAt;
    investmentCount.save();

    // update state
    state.activeInvestments = activeInvestments;
    state.allInvestments = allInvestments;
    state.save();
  } else if (newInvestment) {
    // update number of investments
    let state = currentState();
    let activeInvestments = state.activeInvestments;
    let nonActiveInvestments = state.nonActiveInvestments;
    let allInvestments = state.allInvestments.plus(BigInt.fromI32(1));

    let investmentCount = new InvestmentCount(createdAt.toString());
    investmentCount.all = allInvestments;
    investmentCount.active = activeInvestments;
    investmentCount.nonActive = nonActiveInvestments;
    investmentCount.timestamp = createdAt;
    investmentCount.save();

    // update state
    state.allInvestments = allInvestments;
    state.save();
  }

  return investment as Investment;
}
