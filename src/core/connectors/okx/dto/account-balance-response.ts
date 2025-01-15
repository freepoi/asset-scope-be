export interface AccountBalanceResponse {
  adjEq: string; // 调整后的权益值
  borrowFroz: string; // 借贷冻结资金
  details: AssetDetail[]; // 各币种资产详情
  imr: string; // 初始保证金需求
  isoEq: string; // 仓位的逐仓权益
  mgnRatio: string; // 保证金比率
  mmr: string; // 维持保证金需求
  notionalUsd: string; // 名义价值（USD）
  ordFroz: string; // 挂单冻结资金
  totalEq: string; // 账户总权益
  uTime: string; // 更新时间戳（毫秒）
  upl: string; // 未实现盈亏
}

interface AssetDetail {
  accAvgPx: string; // 平均开仓价格
  availBal: string; // 可用余额
  availEq: string; // 可用权益
  borrowFroz: string; // 借贷冻结资金
  cashBal: string; // 现金余额
  ccy: string; // 币种
  clSpotInUseAmt: string; // 在用额度（跨账户现货）
  crossLiab: string; // 跨账户负债
  disEq: string; // 折算权益
  eq: string; // 币种权益
  eqUsd: string; // 币种权益（折合 USD）
  fixedBal: string; // 固定余额
  frozenBal: string; // 冻结余额
  imr: string; // 初始保证金需求
  interest: string; // 利息
  isoEq: string; // 逐仓账户权益
  isoLiab: string; // 逐仓负债
  isoUpl: string; // 逐仓未实现盈亏
  liab: string; // 总负债
  maxLoan: string; // 最大可借
  maxSpotInUse: string; // 最大在用额度（现货）
  mgnRatio: string; // 保证金比率
  mmr: string; // 维持保证金需求
  notionalLever: string; // 杠杆率
  openAvgPx: string; // 开仓平均价格
  ordFrozen: string; // 挂单冻结资金
  rewardBal: string; // 奖励余额
  smtSyncEq: string; // 智能合约同步权益
  spotBal: string; // 现货余额
  spotCopyTradingEq: string; // 现货跟单账户权益
  spotInUseAmt: string; // 现货在用金额
  spotIsoBal: string; // 现货逐仓余额
  spotUpl: string; // 现货未实现盈亏
  spotUplRatio: string; // 现货未实现盈亏比率
  stgyEq: string; // 策略账户权益
  totalPnl: string; // 总盈亏
  totalPnlRatio: string; // 总盈亏比率
  twap: string; // 时间加权平均价格
  uTime: string; // 更新时间戳（毫秒）
  upl: string; // 未实现盈亏
  uplLiab: string; // 未实现负债
}
