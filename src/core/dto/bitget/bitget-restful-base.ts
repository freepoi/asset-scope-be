export class BitgetHttpResponseBase<T> {
  code: string;
  msg: string;
  requestTime: string;
  data: T;
}
