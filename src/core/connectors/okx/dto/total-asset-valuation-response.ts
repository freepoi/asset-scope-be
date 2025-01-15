export interface TotalAssetValuationResponse {
  details: {
    classic: string; // 经典账户的估值
    earn: string; // 赚币账户的估值
    funding: string; // 资金账户的估值
    trading: string; // 交易账户的估值
  };
  totalBal: string; // 资产总额
  ts: string; // 时间戳
}
