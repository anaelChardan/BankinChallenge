import TransactionsSaver from "../../Application/TransactionsSaver";
import Transactions from "../../Domain/Transactions";
import * as fs from 'fs';
import * as path from 'path';

/**
 * Adapter for saving a Transactions in a file
 */
class FileTransactionsSaver implements TransactionsSaver {
    save(transactions: Transactions): void {
        fs.writeFile(
            path.join(path.join(__dirname, '../../../results'), 'transactions.json'),
            transactions.toJsonString(),
            (error) => {
                if (error) {
                    console.log('Mince erreur 🙈');
                } else {
                    console.log('C\'est fini 👍🏼');
                }
            } 
        )
    }
}

export default FileTransactionsSaver;