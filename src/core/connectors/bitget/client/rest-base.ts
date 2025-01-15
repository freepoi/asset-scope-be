import { HttpException } from '@nestjs/common';
import { createHmac } from 'crypto';

import { APICredentials, Method } from '../types';

export abstract class BitgetBaseRestClient {
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

  public get<T>(path: string, params?: any): Promise<T> {
    return this._call('GET', path, params, true);
  }

  public post<T>(path: string, params?: any): Promise<T> {
    return this._call('POST', path, params, true);
  }

  public getPrivate<T>(path: string, params?: any): Promise<T> {
    return this._call('GET', path, params);
  }

  public postPrivate<T>(path: string, params: any): Promise<T> {
    return this._call('POST', path, params);
  }

  public deletePrivate(path: string, params?: any) {
    return this._call('DELETE', path, params);
  }

  /**
   * Make a HTTP request to a specific path. Private endpoints are automatically signed.
   */
  private async _call(
    method: Method,
    path: string,
    params: object | undefined,
    isPublicApi?: boolean,
  ): Promise<any> {
    const isNoBody = ['GET'].includes(method);
    const serializedParams = this.serializeParams(params, method);
    const body = isNoBody ? undefined : serializedParams;
    let url = new URL(path, this.baseUrl).href;

    url = url.endsWith('/') ? url.slice(0, -1) : url;
    url = isNoBody ? `${url}${serializedParams}` : url;

    let res: Response;
    if (isPublicApi) {
      res = await fetch(url, {
        method,
        body,
      });
    } else {
      const timestamp = Date.now();
      const signature = this.signRequest(
        timestamp,
        method,
        path,
        serializedParams,
      );

      res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'ACCESS-KEY': this.apiKey,
          'ACCESS-SIGN': signature,
          'ACCESS-TIMESTAMP': timestamp.toString(),
          'ACCESS-PASSPHRASE': this.apiPassphrase,
          locale: 'zh_CN',
        },
        body,
      });
    }

    if (!res.ok) {
      const json: { msg: string; code: number } = await res.json();

      throw new HttpException(
        `Failed to fetch assets: ${res.statusText} ${res.status} ${JSON.stringify(json)}`,
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
    timestamp: number,
    method: Method,
    path: string,
    serializedParams: string,
  ): string {
    const message = `${timestamp}${method}${path}${serializedParams}`;

    return createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('base64');
  }

  private serializeParams(params: object | undefined, method: Method): string {
    if (!params) {
      return '';
    }

    if (method !== 'GET') {
      return JSON.stringify(params);
    }

    const queryString = Object.entries(params)
      .filter(pair => pair[1] !== undefined)
      .sort((a, b) => {
        if (a[0] < b[0]) {
          return -1;
        }
        if (a[0] > b[0]) {
          return 1;
        }

        return 0;
      })
      .map(pair => `${pair[0]}=${pair[1]}`)
      .join('&');

    // Prevent trailing `?` if no params are provided
    return queryString ? `?${queryString}` : queryString;
  }
}
