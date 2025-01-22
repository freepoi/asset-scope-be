import { Controller, Get } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { GateAssetService } from './gate-asset.service';
import { BinanceAssetService } from './binance-asset.service';
import { OkxAssetService } from './okx-asset.service';
import { BitgetAssetService } from './bitget-asset.service';

@Controller()
export class AppController {
  constructor(
    private readonly gateAssetService: GateAssetService,
    private readonly binanceAssetService: BinanceAssetService,
    private readonly okxAssetService: OkxAssetService,
    private readonly bitgetAssetService: BitgetAssetService,
  ) {}

  @Get('balance/overview')
  async getAssets() {
    const [gateAccounts, binanceAccounts, okxAccounts, bitgetAccounts] =
      await Promise.all([
        this.gateAssetService.getTotalBalance(),
        this.binanceAssetService.getTotalBalance(),
        this.okxAssetService.getTotalBalance(),
        this.bitgetAssetService.getTotalBalance(),
      ]);

    const bnTotalBalance = binanceAccounts.reduce(
      (acc: BigNumber, curr) => acc.plus(curr.balance),
      BigNumber(0),
    );
    const gateTotalBalance = gateAccounts.reduce(
      (acc: BigNumber, curr) => acc.plus(curr.balance),
      BigNumber(0),
    );
    const okxTotalBalance = okxAccounts.reduce((acc: BigNumber, curr) => {
      return acc.plus(curr.balance);
    }, BigNumber(0));
    const bitgetTotalBalance = bitgetAccounts.reduce((acc: BigNumber, curr) => {
      return acc.plus(curr.balance);
    }, BigNumber(0));

    console.log(
      'binance',
      bnTotalBalance.toFixed(0),
      binanceAccounts.map(
        b => `${b.name} [uid: ${b.uid}] balance: ${b.balance.toFixed(0)}`,
      ),
    );
    console.log(
      'gate',
      gateTotalBalance.toFixed(0),
      gateAccounts.map(
        b => `${b.name} [uid: ${b.uid}] balance: ${b.balance.toFixed(0)}`,
      ),
    );
    console.log(
      'okx',
      okxTotalBalance.toFixed(0),
      okxAccounts.map(
        b => `${b.name} [uid: ${b.uid}] balance: ${b.balance.toFixed(0)}`,
      ),
    );
    console.log(
      'bitget',
      bitgetTotalBalance.toFixed(0),
      bitgetAccounts.map(
        b => `${b.name} [uid: ${b.uid}] balance: ${b.balance.toFixed(0)}`,
      ),
    );

    const totalBalanceAmongAllExchanges = bnTotalBalance
      .plus(gateTotalBalance)
      .plus(okxTotalBalance)
      .plus(bitgetTotalBalance)
      .toFixed(0);

    return {
      total: totalBalanceAmongAllExchanges,
      binance: {
        totalBalance: bnTotalBalance.toFixed(0),
        accounts: binanceAccounts.map(account => ({
          ...account,
          balance: account.balance.toFixed(0),
          wallets: account.wallets,
        })),
      },
      gate: {
        totalBalance: gateTotalBalance.toFixed(0),
        accounts: gateAccounts.map(account => ({
          ...account,
          balance: account.balance.toFixed(0),
          wallets: account.wallets,
        })),
      },
      okx: {
        totalBalance: okxTotalBalance.toFixed(0),
        accounts: okxAccounts.map(account => ({
          ...account,
          balance: account.balance.toFixed(0),
          wallets: account.wallets,
        })),
      },
      bitget: {
        totalBalance: bitgetTotalBalance.toFixed(0),
        accounts: bitgetAccounts.map(account => ({
          ...account,
          balance: account.balance.toFixed(0),
          wallets: account.wallets,
        })),
      },
    };
  }

  @Get('balance/gate')
  async getGateTotalBalance() {
    return await this.gateAssetService.getTotalBalance();
  }

  @Get('balance/binance')
  async getBinanceTotalBalance() {
    const total = await this.binanceAssetService.getTotalBalance();

    return total;
  }

  @Get('balance/okx')
  async getOkxTotalBalance() {
    const total = await this.okxAssetService.getTotalBalance();

    return total;
  }

  @Get('balance/bitget')
  async getBitgetTotalBalance() {
    return await this.bitgetAssetService.getTotalBalance();
  }

  @Get('assets/bitget')
  async getBitgetAssets() {
    const [spotAssets, earnAssets] = await Promise.all([
      this.bitgetAssetService.getSpotAssets(),
      this.bitgetAssetService.getEarnAssets(),
    ]);

    return {
      spotAssets,
      earnAssets,
    };
  }
}
