import TransactionsQueueConstructor from "./TransactionsQueueConstructor";
import Transaction from "../../Domain/Transaction";

/**
 * Interface that should respect a queue
 */
interface TransactionsQueue {
    /**
     * @param {number} transactionFrom where to start the job
     */
    enqueue(transactionFrom: number);
}

export default TransactionsQueue;