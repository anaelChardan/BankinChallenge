import Transaction from "../../Domain/Transaction";

/**
 * A QueueTask result
 */
class TaskResult {
    constructor(public from: number, public transactions: Transaction[]) {}
}

export default TaskResult;