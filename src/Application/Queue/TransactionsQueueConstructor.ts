import Transaction from "../../Domain/Transaction";
import TaskResult from "./TaskResult";

/**
 * Constructor that should respect a queue
 */
interface TransactionsQueueConstructor {
    new (
        concurrentTasks: number,
        processGetTransactions: (from: number) => Promise<Transaction[]>,
        onFinishGetTransactions: (taskId: number, taskResult: TaskResult) => void,
        onFinishGetAllTransactions: () => void
    )
}

export default TransactionsQueueConstructor;