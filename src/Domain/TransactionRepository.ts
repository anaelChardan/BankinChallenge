import Transaction from './Transaction'

interface TransactionRepository {
    getTransactions(from: number): Promise<Transaction[]>
}

export default TransactionRepository;