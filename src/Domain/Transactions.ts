import Transaction from "./Transaction";

/**
 * Alias for a set of transaction
 */
class Transactions {
    private transactions: Set<Transaction> = new Set();

    /**
     * Add transaction to the collection
     * 
     * @param {Transaction[]} transactions the transaction to add
     */
    public addTransactions(transactions: Transaction[]): void {
        transactions.forEach(t => this.transactions.add(t));
    }

    /**
     * 
     */
    public length(): number {
        return this.transactions.size;
    }

    public toJsonString(): string {
        const sortedResults = [...this.transactions].sort((t1, t2) => t1.id - t2.id);
        
        return JSON.stringify(sortedResults.map(t => t.toJsonObject()), null, 2);
    }
}

export default Transactions;