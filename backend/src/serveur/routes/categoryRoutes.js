import express from "express";

const router = express.Router();

// GET : récupérer toutes les catégories
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Alimentation" },
    { id: 2, name: "Transport" },
    { id: 3, name: "Loisirs" }
  ]);
});

// POST : ajouter une catégorie
router.post("/", (req, res) => {
  const { name } = req.body;
  // Ici, tu peux ajouter la logique pour stocker la catégorie
  res.status(201).json({ message: "Catégorie ajoutée", category: { id: Date.now(), name } });
});

export default router;
