export interface GateWalletTotalBalanceResponse {
  details: {
    delivery: {
      currency: string;
      amount: string;
      unrealised_pnl: string;
    };
    finance: {
      currency: string;
      amount: string;
    };
    futures: {
      currency: string;
      amount: string;
      unrealised_pnl: string;
    };
    margin: {
      currency: string;
      amount: string;
      borrowed: string;
    };
    options: {
      currency: string;
      amount: string;
      unrealised_pnl: string;
    };
    payment: {
      currency: string;
      amount: string;
    };
    pilot: {
      currency: string;
      amount: string;
    };
    quant: {
      currency: string;
      amount: string;
    };
    spot: {
      currency: string;
      amount: string;
    };
  };
  total: {
    amount: string;
    borrowed: string;
    currency: string;
    unrealised_pnl: string;
  };
}
