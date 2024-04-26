import BigNumber from 'bignumber.js';
import { makeAutoObservable } from 'mobx';
import { helper } from '../../lib/helper';
export class BigNumberInputState {
  value = new BigNumber(0);
  format = '';
  loading = false;
  decimals = 18;
  formatter?: Function;
  constructor(args: Partial<BigNumberInputState>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }
  get noDecimasValue(): BigNumber {
    return new BigNumber(this.value).dividedBy(10 ** this.decimals);
  }
  setValue(value: any) {
    this.value = new BigNumber(value);
    // this.format = helper.number.toPrecisionFloor(new BigNumber(this.value).dividedBy(10 ** this.decimals).toFixed());
    this.format = helper.number.warpBigNumber(this.value.toFixed(), this.decimals, { format: '0.000', fallback: '' }).format;
    this.setLoading(false);
  }
  setFormat(val: any) {
    this.format = val;
    // this.format = helper.number.toPrecisionFloor(this.format);
    // this.format = helper.number.warpBigNumber(this.value.toFixed(), this.decimals, { format: '0.000', fallback: '' }).format;
    this.value = new BigNumber(val).multipliedBy(10 ** this.decimals);
  }
  setLoading(val: boolean) {
    this.loading = val;
  }
  setDecimals(val: number) {
    this.decimals = val;
  }
  get isZero(): boolean {
    return this.value.isZero() && this.format == '';
  }
}
