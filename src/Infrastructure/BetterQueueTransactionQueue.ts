import TransactionsQueue from './../Application/Queue/TransactionsQueue';
import Transactions from '../Domain/Transactions';
import Transaction from '../Domain/Transaction';
import TaskResult from '../Application/Queue/TaskResult';
const Queue = require('better-queue');

/**
 * Adapter of the TransactionsQueue for BetterQueue
 */
class BetterQueueTransactionQueue implements TransactionsQueue {
    /**
     * The BetterQueue
     */
    private queue;

    /**
     * @param {number} concurrentTasks Number of task in concurrency
     * @param {callback} processGetTransactions CallBack to get a bench of transactions
     * @param {callback} onFinishGetTransactions CallBack when a task is finish on the queue
     * @param {callback} onFinishGetAllTransactions CallBack when everything is done on the queue
     */
    constructor(
        private concurrentTasks: number,
        private processGetTransactions: (from: number) => Promise<Transaction[]>,
        private onFinishGetTransactions: (taskId: number, taskResult: TaskResult) => void,
        private onFinishGetAllTransactions: () => void
    ) {
        this.queue = new Queue((input, proccessed: (error, result: Transaction[]|any) => void) => {
            this.processGetTransactions(input.transactionFrom)
                .then(result => proccessed(null, new TaskResult(input.id, result)))
                .catch(error => proccessed(error, null));
        }, {concurrent: concurrentTasks});

        this.queue.on('task_finish', (taskId, transaction) => this.onFinishGetTransactions(taskId, transaction));
        this.queue.on('drain', () => this.onFinishGetAllTransactions());
    }

    /**
     * Enqueue a transaction query
     *
     * @param {number} transactionFrom 
     */
    public enqueue(transactionFrom: number): void {
        this.queue.push({id: transactionFrom + 1, transactionFrom: transactionFrom});
    }
}

export default BetterQueueTransactionQueue;