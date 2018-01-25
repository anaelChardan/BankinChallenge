import Transactions from "../Domain/Transactions";

/**
 * Adapter for saving transactions
 */
interface TransactionsSaver {
    save(transactions: Transactions): void
}

export default TransactionsSaver;