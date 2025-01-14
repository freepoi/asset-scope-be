import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, createHmac } from 'crypto';
import { EnvOptionName } from './core/enum/config-variable-name';
import { GateTotalBalance } from './core/dto/gate/total-balance';

@Injectable()
export class GateAssetService {
  constructor(private configService: ConfigService) {}

  async getTotalBalance(): Promise<GateTotalBalance> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const method = 'GET';
    const requestPath = '/api/v4/wallet/total_balance';
    const queryString = '';
    const payloadString = '';
    const hashedPayload = createHash('sha512')
      .update(payloadString)
      .digest('hex');
    const contentToSign = [
      method,
      requestPath,
      queryString,
      hashedPayload,
      timestamp,
    ].join('\n');
    const secret = this.configService.get(EnvOptionName.GATE_SECRET_KEY);
    const signature = createHmac('sha512', secret)
      .update(contentToSign)
      .digest('hex');
    const apiURLBase = this.configService.get(EnvOptionName.GATE_URL_BASE);

    const url = `${apiURLBase}${requestPath}`;
    const headers = {
      KEY: this.configService.get(EnvOptionName.GATE_API_KEY),
      SIGN: signature,
      Timestamp: timestamp,
    };
    const res = await fetch(url, { headers });

    if (res.ok) {
      const data = (await res.json()) as GateTotalBalance;

      return data;
    }

    const text = await res.text();
    throw new HttpException(`Failed to fetch assets: ${text}`, res.status);
  }
}
