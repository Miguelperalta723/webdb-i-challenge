const express = require('express');

const db = require('./data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    db('accounts')
      .then(accounts => {
        res.status(200).json(accounts);
      })
      .catch(() => {
        res.status(500).json({ message: 'Could not retrieve the list of accounts' });
      });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    db("accounts")
      .where({ id: id })
      .first()
      .then(account => {
        if (account) {
          res.status(200).json(account);
        } else {
          res.status(404).json({ message: "Account does not exist" });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Unable to fetch account from database" });
      });
});

router.post("/", (req, res) => {
    const newAccount = req.body;
    if (!newAccount.name) {
      res.status(404).json({ message: "Please add an account name" });
    }
    if (!newAccount.budget) {
      res.status(404).json({ message: "Please add an account budget" });
    }
    db("accounts")
    .insert(newAccount, "id")
    .then(account => {
        res.status(201).json(account);
    })
    .catch(err => {
        res.status(500).json({ message: "Unable to add account to database" });
    });
});
  
router.put("/:id", (req, res) => {
    const { id } = req.params;
    db('accounts')
    .where({ id: id })
    .update(req.body)
    .then(count => {
      if (count) {
        res.status(200).json({ message: `${count} record(s) updated` });
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Could not update the account' });
    });
});
  
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db("accounts")
    .where({ id: id })
    .del()
    .then(count => {
        if (count) {
          res.status(200).json({ message: `${count} account has been deleted` });
        } else {
          res.status(404).json({ message: "Account not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ message: "Error removing from database" });
    });
});

module.exports = router;