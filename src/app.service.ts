import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { EnvOptionName } from './core/enum/config-variable-name';
import { BitgetHttpResponseBase } from './core/dto/bitget/bitget-restful-base';
import { FundingAsset } from './core/dto/bitget/funding-asset';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async listAssets(): Promise<FundingAsset[]> {
    const timestamp = Date.now();
    const method = 'GET';
    const requestPath = '/api/v2/spot/account/assets';
    const queryString = '';
    const content = `${timestamp}${method.toUpperCase()}${requestPath}${queryString}`;
    const secret = this.configService.get(EnvOptionName.BITGET_SECRET_KEY);
    const signature = createHmac('sha256', secret)
      .update(content)
      .digest('base64');
    const apiURLBase = this.configService.get(
      EnvOptionName.BITGET_URL_BASE,
    );

    const url = `${apiURLBase}${requestPath}`;
    const headers = {
      'ACCESS-KEY': this.configService.get(EnvOptionName.BITGET_API_KEY),
      'ACCESS-SIGN': signature,
      'ACCESS-TIMESTAMP': timestamp.toString(),
      'ACCESS-PASSPHRASE': this.configService.get(
        EnvOptionName.BITGET_PASSPHRASE_PASSPHRASE,
      ),
    };
    const res = await fetch(url, { headers });

    if (res.ok) {
      const data = (await res.json()) as BitgetHttpResponseBase<FundingAsset[]>;

      return data.data;
    }

    const text = await res.text();
    throw new HttpException(`Failed to fetch assets: ${text}`, res.status);
  }

  async overview(): Promise<FundingAsset[]> {
    const timestamp = Date.now();
    const method = 'GET';
    const requestPath = '/api/v2/account/all-account-balance';
    const queryString = '';
    const content = `${timestamp}${method.toUpperCase()}${requestPath}${queryString}`;
    const secret = this.configService.get(EnvOptionName.BITGET_SECRET_KEY);
    const signature = createHmac('sha256', secret)
      .update(content)
      .digest('base64');
    const apiURLBase = this.configService.get(
      EnvOptionName.BITGET_URL_BASE,
    );

    const url = `${apiURLBase}${requestPath}`;
    const headers = {
      'ACCESS-KEY': this.configService.get(EnvOptionName.BITGET_API_KEY),
      'ACCESS-SIGN': signature,
      'ACCESS-TIMESTAMP': timestamp.toString(),
      'ACCESS-PASSPHRASE': this.configService.get(
        EnvOptionName.BITGET_PASSPHRASE_PASSPHRASE,
      ),
    };
    const res = await fetch(url, { headers });

    if (res.ok) {
      const data = (await res.json()) as BitgetHttpResponseBase<FundingAsset[]>;

      return data.data;
    }

    const text = await res.text();
    throw new HttpException(`Failed to fetch assets: ${text}`, res.status);
  }
}
