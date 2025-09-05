import express from 'express';

const router = express.Router();

// Données en mémoire (exemple)
let accounts = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// GET /accounts -> liste tous les comptes
router.get('/', (req, res) => {
  res.json(accounts);
});

// POST /accounts -> créer un nouveau compte
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Nom et email requis' });
  }

  const newAccount = {
    id: accounts.length + 1,
    name,
    email
  };
  accounts.push(newAccount);

  res.status(201).json(newAccount);
});

// GET /accounts/:id -> récupérer un compte par id
router.get('/:id', (req, res) => {
  const account = accounts.find(a => a.id === parseInt(req.params.id));
  if (!account) {
    return res.status(404).json({ message: 'Compte non trouvé' });
  }
  res.json(account);
});

export default router;
