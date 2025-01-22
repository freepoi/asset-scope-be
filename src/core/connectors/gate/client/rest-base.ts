import { HttpException, Logger } from '@nestjs/common';
import { createHash, createHmac } from 'crypto';

import { APICredentials, Method } from '../types';

export abstract class GateBaseRestClient {
  private baseUrl: string;

  private apiKey: string;

  private apiSecret: string;

  constructor(credentials: APICredentials, baseUrl: string) {
    this.baseUrl = baseUrl;
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
  }

  public get<T>(path: string, params?: any): Promise<T> {
    return this._call<T>('GET', path, params, true);
  }

  public post<T>(path: string, params?: any): Promise<T> {
    return this._call<T>('POST', path, params, true);
  }

  public getPrivate<T>(path: string, params?: any): Promise<T> {
    return this._call<T>('GET', path, params);
  }

  public postPrivate<T>(path: string, params: any): Promise<T> {
    return this._call<T>('POST', path, params);
  }

  public deletePrivate<T>(path: string, params?: any): Promise<T> {
    return this._call<T>('DELETE', path, params);
  }

  /**
   * Make a HTTP request to a specific path. Private endpoints are automatically signed.
   */
  private async _call<T>(
    method: Method,
    path: string,
    params: object | undefined,
    isPublicApi?: boolean,
  ): Promise<T> {
    Logger.debug(
      `From ${this.apiKey}, ${method} ${path} at ${new Date().toLocaleString()}`,
    );
    const isNoneBody = ['GET'].includes(method);
    const queryString = isNoneBody ? this.serializeQueryString(params) : '';
    const bodyString = isNoneBody ? '' : JSON.stringify(params);
    let url = new URL(path, this.baseUrl).href;

    url = url.endsWith('/') ? url.slice(0, -1) : url;
    url = isNoneBody ? `${url}${queryString ? '?' : ''}${queryString}` : url;

    let res: Response;
    if (isPublicApi) {
      res = await fetch(url, {
        method,
        body: bodyString || undefined,
      });
    } else {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = this.signRequest(
        timestamp,
        method,
        path,
        queryString,
        bodyString,
      );

      res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          KEY: this.apiKey,
          SIGN: signature,
          Timestamp: timestamp,
        },
        body: bodyString || undefined,
      });
    }

    if (!res.ok) {
      const json: { msg: string; code: number } = await res.json();

      throw new HttpException(
        `Failed to fetch gate assets, link: ${url}, status: ${res.status} ${res.statusText}, message: ${JSON.stringify(json)}`,
        500,
      );
    }

    return await res.json();
  }

  private signRequest(
    timestamp: string,
    method: Method,
    path: string,
    queryString: string,
    payloadString: string,
  ): string {
    const hashedPayload = createHash('sha512')
      .update(payloadString)
      .digest('hex');
    const message = [method, path, queryString, hashedPayload, timestamp].join(
      '\n',
    );

    return createHmac('sha512', this.apiSecret).update(message).digest('hex');
  }

  private serializeQueryString(params?: object): string {
    if (!params) {
      return '';
    }

    return Object.entries(params)
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
  }
}
