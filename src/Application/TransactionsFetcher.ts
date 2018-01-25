import TransactionsQueue from "./Queue/TransactionsQueue";
import TransactionsQueueConstructor from "./Queue/TransactionsQueueConstructor";
import TransactionRepository from "../Domain/TransactionRepository";
import Transactions from "../Domain/Transactions";
import Transaction from "../Domain/Transaction";
const Queue = require('better-queue');
import TaskResult from "./Queue/TaskResult";

/**
 * Our use case, scrap everything
 */
class TransactionsFetcher {
    readonly TRANSACTION_BATCH_SIZE = 50;
    readonly CONCURRENT_TASKS = 30;
    
    private nextPage = (this.CONCURRENT_TASKS - 2) * this.TRANSACTION_BATCH_SIZE;
    private transactions: Transactions;
    private queue: TransactionsQueue;

    /**
     * @param {TransactionQueueContructor} transactionQueueConstructor the implementation of a queue
     * @param {TransactionRepository} repository the repository
     * @param {callback} resolve the callback called when everything is finished
     */
    constructor(
        transactionQueueConstructor: TransactionsQueueConstructor, 
        private repository: TransactionRepository,
        private resolve: (transactions: Transactions) => void
    ) {
        this.transactions = new Transactions();
        this.queue = new transactionQueueConstructor(
            this.CONCURRENT_TASKS,
            (from: number) => this.repository.getTransactions(from),
            (taskId: number, taskResult: TaskResult) => this.onFinishGetTransactions(taskId, taskResult),
            () => this.onFinishGetAllTransactions()
        );
    } 

    /**
     * Fetch all transactions
     */
    fetch(): void {
        [...Array(this.CONCURRENT_TASKS - 1).keys()]
            .forEach(index => this.queue.enqueue(index * this.TRANSACTION_BATCH_SIZE));
    }

    /**
     * Callback when a job is finished
     *
     * @param {number} taskId the task id
     * @param {TaskResult} taskResult the result containing transactions
     */
    private onFinishGetTransactions(taskId: number, taskResult: TaskResult): void {
        const isTheLastPage = taskResult.transactions.length < this.TRANSACTION_BATCH_SIZE;
        
        this.transactions.addTransactions(taskResult.transactions);

        if (!isTheLastPage) {
            this.nextPage += taskResult.transactions.length;
            this.queue.enqueue(this.nextPage);
        }
    }

    /**
     * Callback when all transactions are scrapped
     */
    private onFinishGetAllTransactions(): void {
        this.resolve(this.transactions);
    }
}

export default TransactionsFetcher;