module.exports = function(app) {
    /**
     * @swagger
     * path:
     *  /transfer:
     *    post:
     *      summary: Perform transfer betwwen accounts
     *      requestBody:
     *        required: true
     *        content:
     *          application/json:  
     *              schema:
     *                  type: object
     *                  properties:
     *                      fromAccount:          
     *                         type: number
     *                      toAccount:  
     *                          type: integer
     *                      amount:  
     *                          type: double
     *                  required:
     *                       - fromAccount
     *                       - toAccount
     *                       - amount
     *      responses:
     *        "200":
     *          result: Result of the transaction
     *          content:
     *            application/json:
     *               schema:
     *                  type: object
     *                  properties:
     *                      success:          
     *                         type: boolean
     */
    app.post('/transfer', (req, res) => {
        console.log(req);
        console.log(req.body);
        let from = req.body.fromAccount;
        let to = req.body.toAccount;
        let amount = req.body.amount;
        console.log(from);
        console.log(to);
        var accounts = app.get('accounts');
        let accTrans = accounts.find(acc => acc.account == from);
        let accReceive = accounts.find(acc => acc.account == to);
        if (amount <= accTrans.balance) {
            accReceive.balance = accReceive.balance + amount;
            accTrans.balance = accTrans.balance - amount;
            var row = req.body;
            var history = app.get('history');
            row.sentAt = new Date();
            history.push(row);
            console.log(accReceive);
            console.log(accReceive);
            console.log(history);
            res.send({ 'success': true });
        } else {
            //console.log(accReceive);
            res.send({ 'success': false, 'msj': 'There is not enogh found to perform the transfer' });
        }
    });
    /**
     * @swagger
     * path:
     *  /allTransactions:
     *    get:
     *      summary: Consult account transactions
     *      parameters:
     *          - in: query
     *            name: accountId
     *            schema:
     *              type: number
     *            required: true
     *            description: Account number
     *          - in: query
     *            name: type
     *            schema:
     *              type: string
     *            required: false
     *            description: Account number
     * 
     *      responses:
     *        "200":
     *          description: Array of account transactions
     *          content:
     *            application/json:
     *               schema:
     *                  type: array
     *                  items:
     *                    type:object
     *                  
     */
    app.get('/allTransactions', (req, res) => {
        let id = req.query.accountId;
        let type = req.query.type;
        console.log(id);
        let history = app.get('history');
        let transactions;
        switch (type) {
            case 'R':
                transactions = history.filter(acc => acc.toAccount == id);
                break;
            case 'S':
                transactions = history.filter(acc => acc.fromAccount == id);
                break;
            default:
                transactions = history.filter(acc => acc.fromAccount == id || acc.toAccount == id);
        }
        console.log(transactions);
        res.send({ 'transactions': transactions });
    });
    /**
     * @swagger
     * path:
     *  /balance:
     *    get:
     *      summary: Consult account balance
     *      parameters:
     *          - in: query
     *            name: accountId
     *            schema:
     *              type: number
     *            required: true
     *            description: Account number
     * 
     *      responses:
     *        "200":
     *          description: Object with account balance
     *          content:
     *            application/json:
     *               schema:
     *                  type: object
     *                  
     */
    app.get('/balance', (req, res) => {
        let id = req.query.accountId;
        let accounts = app.get('accounts');
        res.send({ 'balance': accounts.find(acc => acc.account == id) });
    });
};