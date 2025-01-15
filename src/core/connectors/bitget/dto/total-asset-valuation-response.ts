export interface BitgetAccountBalance {
  accountType: string;
  usdtBalance: string;
}

export type BitgetAccountBalanceResponse = BitgetAccountBalance[];
