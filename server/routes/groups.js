
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured groups (limit to 6)
router.get('/featured', async (req, res) => {
  try {
    const featuredGroups = await Group.find()
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(featuredGroups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific group
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new group
router.post('/', async (req, res) => {
  const group = new Group(req.body);
  try {
    const newGroup = await group.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a group
router.patch('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if the user updating is the creator
    if (group.createdBy.email !== req.body.userEmail) {
      return res.status(403).json({ message: 'You are not authorized to update this group' });
    }
    
    // Remove userEmail from the update data
    const { userEmail, ...updateData } = req.body;
    
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a group
router.delete('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if the user deleting is the creator
    const userEmail = req.query.userEmail;
    if (group.createdBy.email !== userEmail) {
      return res.status(403).json({ message: 'You are not authorized to delete this group' });
    }
    
    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a group
router.post('/:id/join', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if the group's start date has passed
    if (new Date(group.startDate) < new Date()) {
      return res.status(400).json({ message: 'This group is no longer active' });
    }
    
    // Check if the group is full
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: 'This group is already full' });
    }
    
    // Check if the user is already a member
    const { email } = req.body;
    const alreadyMember = group.members.find(member => member.email === email);
    
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }
    
    // Add the new member
    group.members.push(req.body);
    const updatedGroup = await group.save();
    
    res.json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get groups created by a specific user
router.get('/user/:email', async (req, res) => {
  try {
    const userGroups = await Group.find({ 'createdBy.email': req.params.email });
    res.json(userGroups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
