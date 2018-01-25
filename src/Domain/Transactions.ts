import Transaction from "./Transaction";

class Transactions {
    private transactions: Set<Transaction> = new Set();

    public addTransactions(transactions: Transaction[]): void {
        transactions.forEach(t => this.transactions.add(t));
    }

    public toJson() {
        return [...this.transactions].map(t => t.toJsonObject());
    }
}

export default Transactions;