import { Address } from '@graphprotocol/graph-ts';
import { AmguPaid, LogSetAuthority, LogSetOwner, NewFund } from '../../generated/v1/VersionContract/VersionContract';
import { ensureVersion } from '../../utils/version';
import { trackVersionEvent } from '../../utils/event';
import { ensureFund } from '../../utils/fund';

export function handleAmguPaid(event: AmguPaid): void {
  trackVersionEvent('AmguPaid', event, event.address);
  let version = ensureVersion(event.address);
}

export function handleLogSetAuthority(event: LogSetAuthority): void {
  trackVersionEvent('LogSetAuthority', event, event.address);
  let version = ensureVersion(event.address);
}

export function handleLogSetOwner(event: LogSetOwner): void {
  trackVersionEvent('LogSetOwner', event, event.address);
  let version = ensureVersion(event.address);
}

export function handleNewFund(event: NewFund): void {
  trackVersionEvent('NewFund', event, event.address);
  let version = ensureVersion(event.address);
  let fund = ensureFund(event.params.hub);
}
