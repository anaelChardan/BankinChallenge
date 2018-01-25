import Transaction from "../../Domain/Transaction";

/**
 * Data Transfer Object for TransacationRow
 */
class BankinTransactionRow {
    readonly account: string;
    readonly name: string;
    readonly operation: string;

    /**
     * @param {string[]} row the row fetched 
     */
    constructor(row: string[]) {
        this.account = row[0];
        this.name = row[1];
        this.operation = row[2];
    };

    /**
     * Transform the row into a DomainTransaction
     * 
     * @returns {Transaction} the domain transaction
     */
    toTransaction(): Transaction {
        const id = parseFloat(this.name.match(/\d+/)[0]);
        const amount = this.operation.match(/\d+/)[0];
        const currency = this.operation.replace(amount, '').trim();
        
        return new Transaction(id, this.account, this.name, parseFloat(amount), currency);
    }
}

export default BankinTransactionRow;