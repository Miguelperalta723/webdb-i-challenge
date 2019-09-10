const express = require('express');

const db = require('./data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    db('accounts')
      .then(accounts => {
        res.status(200).json(accounts);
      })
      .catch(() => {
        res.status(500).json({ message: 'cant get accounts' });
      });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    db("accounts")
      .where({ id })
      .first()
      .then(account => {
        if (account) {
          res.status(200).json(account);
        } else {
          res.status(404).json({ message: "check account id" });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "something went wrong" });
      });
});

router.post("/", (req, res) => {
    const newAccount = req.body;
    if (!newAccount.name) {
      res.status(404).json({ message: "no account name" });
    }
    if (!newAccount.budget) {
      res.status(404).json({ message: "no account budget" });
    }
    db("accounts").insert(newAccount)
    .then(account => {
        res.status(201).json(account);
    })
    .catch(err => {
        res.status(500).json({ message: "Unable to add account" });
    });
});
  
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    db('accounts')
    .where({ id }).update(changes)
    .then(count => {
      if (count) {
        res.status(200).json({ message: 'account updated' });
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Could not update account' });
    });
});
  
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db("accounts")
    .where({ id }).del()
    .then(count => {
        if (count) {
          res.status(200).json({ message: 'account deleted' });
        } else {
          res.status(404).json({ message: "Account not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ message: "Error deleting from database" });
    });
});

module.exports = router;