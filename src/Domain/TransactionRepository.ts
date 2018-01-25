import Transaction from './Transaction'

/**
 * Port for TransactionRepository
 */
interface TransactionRepository {
    /**
     * @param {number} from the page start to query
     * 
     * @returns {Promise<Transaction[]>} the transaction result
     */
    getTransactions(from: number): Promise<Transaction[]>
}

export default TransactionRepository;