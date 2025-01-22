import { HttpException, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';

import { APICredentials, Method } from '../types';
import { serializeParams } from '../helper/serialize-params';

export default abstract class OkxBaseRestClient {
  private baseUrl: string;

  private apiKey: string;

  private apiSecret: string;

  private apiPassphrase: string;

  constructor(credentials: APICredentials, baseUrl: string) {
    this.baseUrl = baseUrl;
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    this.apiPassphrase = credentials.apiPassPhrase;
  }

  public get<T>(endpoint: string, params?: any): Promise<T> {
    return this._call('GET', endpoint, params, true);
  }

  public post<T>(endpoint: string, params?: any): Promise<T> {
    return this._call('POST', endpoint, params, true);
  }

  public getPrivate<T>(endpoint: string, params?: any): Promise<T> {
    return this._call('GET', endpoint, params);
  }

  public postPrivate<T>(endpoint: string, params: any): Promise<T> {
    return this._call('POST', endpoint, params);
  }

  public deletePrivate(endpoint: string, params?: any) {
    return this._call('DELETE', endpoint, params);
  }

  /**
   * Make a HTTP request to a specific endpoint. Private endpoints are automatically signed.
   */
  private async _call(
    method: Method,
    endpoint: string,
    params: object | undefined,
    isPublicApi?: boolean,
  ): Promise<any> {
    Logger.debug(
      `From ${this.apiKey}, ${method} ${endpoint} at ${new Date().toLocaleString()}`,
    );
    const isNoBody = ['GET'].includes(method);
    const serializedParams = serializeParams(params, method);
    const body = isNoBody ? undefined : serializedParams;
    let url = new URL(endpoint, this.baseUrl).href;

    url = url.endsWith('/') ? url.slice(0, -1) : url;
    url = isNoBody ? `${url}${serializedParams}` : url;

    let res: Response;
    if (isPublicApi) {
      res = await fetch(url, {
        method,
        body,
      });
    } else {
      const timestamp = new Date().toISOString();
      const signature = this.signRequest(
        timestamp,
        method,
        endpoint,
        serializedParams,
      );

      res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'OK-ACCESS-KEY': this.apiKey,
          'OK-ACCESS-SIGN': signature,
          'OK-ACCESS-TIMESTAMP': timestamp,
          'OK-ACCESS-PASSPHRASE': this.apiPassphrase,
        },
        body,
      });
    }

    if (!res.ok) {
      const json: { msg: string; code: number } = await res.json();

      throw new HttpException(
        `Failed to fetch Okx assets, link: ${url}, status: ${res.status} ${res.statusText}, message: ${JSON.stringify(json)}`,
        500,
      );
    }

    const data = (await res.json()) as {
      code: number;
      data: any;
      msg: string;
    };

    return data.data;
  }

  private signRequest(
    tsISO: string,
    method: Method,
    endpoint: string,
    serializedParams: string,
  ): string {
    const message = `${tsISO}${method}${endpoint}${serializedParams}`;

    return createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('base64');
  }
}
