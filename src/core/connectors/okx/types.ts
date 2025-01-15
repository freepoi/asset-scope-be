export interface APICredentials {
  apiKey: string;
  apiSecret: string;
  apiPassPhrase: string;
}

export type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
