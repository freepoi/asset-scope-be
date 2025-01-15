export interface BnWallet {
  getWalletBalances(): Promise<
    {
      activate: boolean;
      balance: string;
      walletName: string;
    }[]
  >;
}
