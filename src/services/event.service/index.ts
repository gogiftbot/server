import EventEmitter from "events";

class Emitter extends EventEmitter {
  public EVENTS = {
    ON_DEPOSIT: "ON_DEPOSIT",
    ON_WITHDRAW: "ON_WITHDRAW",
  };

  constructor() {
    super();
  }

  onDeposit(transactionId: string) {
    this.emit(this.EVENTS.ON_DEPOSIT, transactionId);
  }

  onWithdraw(transactionId: string) {
    this.emit(this.EVENTS.ON_WITHDRAW, transactionId);
  }
}

export const emitter = new Emitter();
