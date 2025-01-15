import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BigNumber from 'bignumber.js';

import { EnvOptionName } from './core/enum/config-variable-name';
import { BnAPI } from './core/connectors/binance';
import { ClientBaseService } from './client-base.service';

@Injectable()
export class BinanceAssetService extends ClientBaseService<BnAPI> {
  constructor(protected configService: ConfigService) {
    super(configService, EnvOptionName.binance, BnAPI);
  }

  protected getCreationParams(): ConstructorParameters<typeof BnAPI> {
    return [
      this.config.key_pairs[0].api_key,
      this.config.key_pairs[0].api_secret,
      {},
    ];
  }

  async getTotalBalance(key?: string) {
    const clients = this.getClients(key);
    const walletBalances = await Promise.all(
      clients.map(client => client.getWalletBalances()),
    );
    const btcPrice = await this.getSymbolPriceVsUsdt('BTC');

    return walletBalances
      .filter(wallet => wallet[0].balance !== '0')
      .map(wallet => ({
        ...wallet,
        balance: BigNumber(wallet[0].balance).multipliedBy(btcPrice),
      }))
      .reduce(
        (acc: BigNumber, wallet) => acc.plus(wallet.balance),
        BigNumber(0),
      );
  }

  async getSymbolPriceVsUsdt(symbol: string) {
    const result = await this.clients[0].symbolPriceTicker({
      symbol: `${symbol}USDT`,
    });

    return (result as { price: string }).price;
  }
}
