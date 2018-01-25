import TransactionsQueueConstructor from "./TransactionsQueueConstructor";
import Transaction from "../Domain/Transaction";

interface TransactionsQueue {
    enqueue(transactionFrom: number);
}

export default TransactionsQueue;