import { BigInt, dataSource } from "@graphprotocol/graph-ts";
import { FundSlug, Version } from "../codegen/schema";
import { nameToSlug } from "./nameToSlug";

export function generateSlug(
  name: string,
  address: string,
  manager: string,
  version: string
): void {
  let slug = nameToSlug(name);

  let versionEntity = Version.load(version) as Version;
  if (
    dataSource.network() == "mainnet" &&
    versionEntity.timestamp < BigInt.fromI32(1581897111)
  ) {
    slug = slug + "-v-" + nameToSlug(versionEntity.name as string);
  }

  let fundslug = FundSlug.load(slug);

  if (!fundslug) {
    let newFundslug = new FundSlug(slug);
    newFundslug.fund = address;
    newFundslug.manager = manager;
    newFundslug.version = version;
    newFundslug.save();
  } else if (fundslug.manager != manager) {
    // existing slug, different manager
    // => add number suffix to slug
    for (let i: i32 = 2; i < 1000; i++) {
      let iterableId = fundslug.id + "-" + BigInt.fromI32(i).toString();
      let iterableSlug = FundSlug.load(iterableId);

      if (iterableSlug) {
        continue;
      }

      let newFundslug = new FundSlug(iterableId);
      newFundslug.fund = address;
      newFundslug.manager = manager;
      newFundslug.version = version;
      newFundslug.save();
      break;
    }
  } else {
    // existing slug, same manager
    // => add version suffix to slug

    let oldFundSlug = new FundSlug(
      fundslug.id + "-v-" + nameToSlug(versionEntity.name as string)
    );
    oldFundSlug.fund = fundslug.fund;
    oldFundSlug.manager = fundslug.manager;
    oldFundSlug.version = fundslug.version;
    oldFundSlug.save();

    fundslug.fund = address;
    fundslug.manager = manager;
    fundslug.version = version;
    fundslug.save();
  }
}
