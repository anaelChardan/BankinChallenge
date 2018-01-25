import Transaction from "../../Domain/Transaction";

class BankinTransactionRow {
    readonly account;
    readonly name;
    readonly operation;

    constructor(row: string[]) {
        this.account = row[0];
        this.name = row[1];
        this.operation = row[2];
    };

    toTransaction(): Transaction {
        const amount: number = parseFloat(this.operation.match(/\d+/)[0]);
        const currency = this.operation.replace(amount, '').trim();
        return new Transaction(this.account, this.name, amount, currency);
    }
}

export default BankinTransactionRow;