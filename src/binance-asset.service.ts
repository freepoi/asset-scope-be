import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BigNumber from 'bignumber.js';

import { EnvOptionName } from './core/enum/config-variable-name';
import { BnAPI } from './core/connectors/binance';
import { ClientBaseService } from './client-base.service';
import { KeyPair } from './config/configuration';

@Injectable()
export class BinanceAssetService extends ClientBaseService<BnAPI> {
  constructor(protected configService: ConfigService) {
    super(configService, EnvOptionName.binance, BnAPI);
  }

  protected getCreationParams(
    pair: KeyPair,
  ): ConstructorParameters<typeof BnAPI> {
    return [pair.api_key, pair.api_secret, {}];
  }

  async getTotalBalance(key?: string) {
    const clients = this.getClients(key);
    const walletBalances = await Promise.all(
      clients.map(client => client.getWalletBalances()),
    );
    const btcPrice = await this.getSymbolPriceVsUsdt('BTC');

    walletBalances.forEach((wallet, i) =>
      console.log(`binance ${this.config.key_pairs[i].name}`, wallet),
    );

    return walletBalances.map((wallet, i) => ({
      name: this.config.key_pairs[i].name,
      uid: this.config.key_pairs[i].uid,
      balance: wallet
        .reduce((acc, curr) => acc.plus(curr.balance), BigNumber(0))
        .multipliedBy(btcPrice),
      wallets: wallet,
    }));
  }

  async getSymbolPriceVsUsdt(symbol: string) {
    const result = await this.clients[0].symbolPriceTicker({
      symbol: `${symbol}USDT`,
    });

    return (result as { price: string }).price;
  }
}
