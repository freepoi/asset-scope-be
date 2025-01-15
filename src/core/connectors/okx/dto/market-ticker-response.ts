export interface MarketTicker {
  instType: string; // 交易类型，如 SPOT
  instId: string; // 交易对，如 MDT-USDT
  last: string; // 最新成交价
  lastSz: string; // 最新成交量
  askPx: string; // 卖一价格
  askSz: string; // 卖一数量
  bidPx: string; // 买一价格
  bidSz: string; // 买一数量
  open24h: string; // 24小时开盘价
  high24h: string; // 24小时最高价
  low24h: string; // 24小时最低价
  volCcy24h: string; // 24小时成交量（以基础货币计量）
  vol24h: string; // 24小时成交量（以报价货币计量）
  ts: string; // 当前时间戳
  sodUtc0: string; // 昨日0点（UTC时间）开盘价
  sodUtc8: string; // 昨日8点（UTC+8时间）开盘价
}
