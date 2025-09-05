import express from "express";

const router = express.Router();

// GET : récupérer les objectifs d'épargne
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Vacances", target: 1000000 },
    { id: 2, name: "Nouvelle voiture", target: 5000000 }
  ]);
});

// POST : créer un objectif d'épargne
router.post("/", (req, res) => {
  const { name, target } = req.body;
  res.status(201).json({ message: "Objectif créé", savings: { id: Date.now(), name, target } });
});

export default router;
