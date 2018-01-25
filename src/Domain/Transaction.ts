class Transaction {
    constructor(private account: String, private transaction: String, private amount: number, private currency: String) {}

    toJsonObject() {
        return {
          account: this.account,
          transaction: this.transaction,
          amount: this.amount,
          currency: this.currency
        };
      }
}

export default Transaction;