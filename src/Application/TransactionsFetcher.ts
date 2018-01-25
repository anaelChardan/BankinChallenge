import TransactionsQueue from "./TransactionsQueue";
import TransactionsQueueConstructor from "./TransactionsQueueConstructor";
import TransactionRepository from "../Domain/TransactionRepository";
import Transactions from "../Domain/Transactions";
import Transaction from "../Domain/Transaction";
const Queue = require('better-queue');
import QueueInput from "./QueueInput";
import TaskResult from "./TaskResult";

class TransactionsFetcher {
    readonly TRANSACTION_BATCH_SIZE = 50;
    readonly CONCURRENT_TASKS = 30;

    private transactions: Transactions;
    private queue: TransactionsQueue;

    constructor(
        transactionQueueConstructor: TransactionsQueueConstructor, 
        private repository: TransactionRepository
    ) {
        this.transactions = new Transactions();
        this.queue = new transactionQueueConstructor(
            this.CONCURRENT_TASKS,
            (from: number) => this.repository.getTransactions(from),
            (taskId: number, taskResult: TaskResult) => this.onFinishGetTransactions(taskId, taskResult),
            () => this.onFinishGetAllTransactions()
        );
    } 

    fetch() {
        [...Array(this.CONCURRENT_TASKS - 1).keys()].forEach(index => this.queue.enqueue(index));
    }

    private onFinishGetTransactions(taskId: number, taskResult: TaskResult): void {
        this.transactions.addTransactions(taskResult.transactions);
        if (taskResult.transactions.length >= this.TRANSACTION_BATCH_SIZE) {
            this.queue.enqueue(taskResult.from + this.TRANSACTION_BATCH_SIZE);
        }
    }

    private onFinishGetAllTransactions(): void {
        console.log(this.transactions);
    }
}

export default TransactionsFetcher;