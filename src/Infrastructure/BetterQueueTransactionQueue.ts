import TransactionsQueue from './../Application/TransactionsQueue';
import Transactions from '../Domain/Transactions';
import Transaction from '../Domain/Transaction';
import QueueInput from '../Application/QueueInput';
import TaskResult from '../Application/TaskResult';
const Queue = require('better-queue');

class BetterQueueTransactionQueue implements TransactionsQueue {
    private queue;

    constructor(
        private concurrentTasks: number,
        private processGetTransactions: (from: number) => Promise<Transaction[]>,
        private onFinishGetTransactions: (taskId: number, taskResult: TaskResult) => void,
        private onFinishGetAllTransactions: () => void
    ) {
        this.queue = new Queue((input, proccessed: (error, result: Transaction[]|any) => void) => {
            this.processGetTransactions(input.id)
                .then(result => proccessed(null, new TaskResult(input.id, result)))
                .catch(error => proccessed(error, null))
        }, {concurrent: concurrentTasks});
        this.queue.on('task_finish', (taskId, transaction) => this.onFinishGetTransactions(taskId, transaction))
        this.queue.on('drain', () => this.onFinishGetAllTransactions());
    }

    public enqueue(transactionFrom: number) {
        this.queue.push({id: transactionFrom, transactionFrom: transactionFrom})
    }
}

export default BetterQueueTransactionQueue;