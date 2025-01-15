import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvOptionName } from './core/enum/config-variable-name';
import { BnAPI } from './core/connectors/binance';
import BigNumber from 'bignumber.js';

@Injectable()
export class BinanceAssetService {
  private apiKey: string;
  private apiSecret: string;
  private client: BnAPI;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get(EnvOptionName.BINANCE_API_KEY);
    this.apiSecret = this.configService.get(EnvOptionName.BINANCE_API_SECRET);
    this.client = new BnAPI(this.apiKey, this.apiSecret);
  }

  async getTotalBalance() {
    const walletBalances = await this.client.getWalletBalances();
    const btcPrice = await this.getSymbolPriceVsUsdt('BTC');

    return walletBalances
      .filter(wallet => wallet.balance !== '0')
      .map(wallet => ({
        ...wallet,
        balance: BigNumber(wallet.balance).multipliedBy(btcPrice),
      }))
      .reduce(
        (acc: BigNumber, wallet) => acc.plus(wallet.balance),
        BigNumber(0),
      );
  }

  async getSymbolPriceVsUsdt(symbol: string) {
    const result = await this.client.symbolPriceTicker({
      symbol: `${symbol}USDT`,
    });

    return (result as { price: string }).price;
  }
}
