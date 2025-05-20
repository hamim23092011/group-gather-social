
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Initial categories to seed the database
const initialCategories = [
  "Drawing & Painting",
  "Photography",
  "Video Gaming",
  "Fishing",
  "Running",
  "Cooking",
  "Reading",
  "Writing",
  "Hiking",
  "Board Games",
  "Gardening",
  "Music"
];

// Get all categories
router.get('/', async (req, res) => {
  try {
    // Check if we have categories in the database
    let categories = await Category.find();
    
    // If no categories exist, seed the database
    if (categories.length === 0) {
      // Create categories from the initial list
      const categoryDocs = initialCategories.map(name => ({ name }));
      await Category.insertMany(categoryDocs);
      
      // Fetch again after seeding
      categories = await Category.find();
    }
    
    // Return just the category names as an array
    const categoryNames = categories.map(cat => cat.name);
    res.json(categoryNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new category
router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name
  });
  
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
