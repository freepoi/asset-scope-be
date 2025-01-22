import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export type KeyPair = {
  api_key: string;
  api_secret: string;
  api_passphrase?: string;
  name: string;
  uid: string;
};

export type ExchangeConfig = {
  api_endpoint_base: string;
  key_pairs: KeyPair[];
};

export type PassphraseKeyPair = {
  api_key: string;
  api_secret: string;
  api_passphrase?: string;
};

export type SimpleKeyPair = {
  api_key: string;
  api_secret: string;
  api_passphrase?: string;
};

export type Configuration = {
  gate?: ExchangeConfig;
  binance?: ExchangeConfig;
  okx?: ExchangeConfig;
  bitget?: ExchangeConfig;
};

export default () => {
  const env = process.env.NODE_ENV || 'development';
  const YAML_CONFIG_FILENAME = `config.${env}.yaml`;

  return yaml.load(
    readFileSync(join(__dirname, '../../', YAML_CONFIG_FILENAME), 'utf8'),
  ) as Configuration;
};
