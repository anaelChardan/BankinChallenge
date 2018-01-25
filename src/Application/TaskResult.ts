import Transaction from "../Domain/Transaction";

class TaskResult {
    constructor(public from: number, public transactions: Transaction[]) {}
}

export default TaskResult;