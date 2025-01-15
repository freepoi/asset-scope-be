import { Controller, Get } from '@nestjs/common';
import { GateAssetService } from './gate-asset.service';
import { BinanceAssetService } from './binance-asset.service';
import { OkxAssetService } from './okx-asset.service';
import { BitgetAssetService } from './bitget-asset.service';
import BigNumber from 'bignumber.js';

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
    const [gateBalance, binanceBalance, okxBalance, bitgetBalance] =
      await Promise.all([
        this.gateAssetService.getTotalBalance(),
        this.binanceAssetService.getTotalBalance(),
        this.okxAssetService.getTotalBalance(),
        this.bitgetAssetService.getTotalBalance(),
      ]);
    const balance = BigNumber(gateBalance)
      .plus(binanceBalance)
      .plus(okxBalance)
      .plus(bitgetBalance)
      .toFixed(0);

    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      style: 'currency',
      currency: 'USD',
    }).format(parseInt(balance));
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
}
