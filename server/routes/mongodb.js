const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// CORS middleware for all routes in this file
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Public route to get all users directly from MongoDB without authentication
router.get('/users', async (req, res) => {
  try {
    // Connect to MongoDB
    const db = mongoose.connection.db;
    
    // Check if we're connected to MongoDB
    if (!db) {
      console.error('Not connected to MongoDB');
      return res.status(500).json({ 
        success: false, 
        error: 'Database Connection Error', 
        message: 'Not connected to MongoDB'
      });
    }
    
    // Log the database name and available collections
    console.log('Connected to database:', db.databaseName);
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Try to find the users collection - might be named 'users' or 'test.users'
    let users = [];
    
    try {
      // First try 'users' collection
      users = await db.collection('users').find({}).toArray();
      console.log('Found users in "users" collection:', users.length);
    } catch (collectionError) {
      console.log('Could not find "users" collection, trying "test.users"');
      try {
        // Then try 'test.users' collection
        users = await db.collection('test.users').find({}).toArray();
        console.log('Found users in "test.users" collection:', users.length);
      } catch (secondError) {
        // Log all collection names for debugging
        console.error('Could not find users collection:', secondError);
      }
    }
    
    // Return the real data
    console.log('Returning users data:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error accessing MongoDB directly:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: 'Failed to fetch users from MongoDB: ' + error.message
    });
  }
});

// Helper function to get the right collection name
const getUsersCollection = async (db) => {
  try {
    // Try to access 'users' collection first
    await db.collection('users').findOne({});
    console.log('Using "users" collection');
    return 'users';
  } catch (error) {
    // If that fails, try 'test.users'
    try {
      await db.collection('test.users').findOne({});
      console.log('Using "test.users" collection');
      return 'test.users';
    } catch (secondError) {
      console.error('Could not determine users collection');
      throw new Error('Users collection not found');
    }
  }
};

// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collectionName = await getUsersCollection(db);
    const collection = db.collection(collectionName);
    
    const userId = req.params.id;
    const updatedData = req.body;
    
    console.log(`Updating user ${userId} with data:`, updatedData);
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(userId);
    
    // Update the user
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updatedData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Not Found', 
        message: `User with ID ${userId} not found`
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'User updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: 'Failed to update user: ' + error.message
    });
  }
});

// Update user credits
router.put('/users/:id/credits', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collectionName = await getUsersCollection(db);
    const collection = db.collection(collectionName);
    
    const userId = req.params.id;
    const { credits } = req.body;
    
    console.log(`Updating credits for user ${userId} to:`, credits);
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(userId);
    
    // Update the user's credits
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: { credits } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Not Found', 
        message: `User with ID ${userId} not found`
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'User credits updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating user credits:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: 'Failed to update user credits: ' + error.message
    });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collectionName = await getUsersCollection(db);
    const collection = db.collection(collectionName);
    
    const userId = req.params.id;
    const { role } = req.body;
    
    console.log(`Updating role for user ${userId} to:`, role);
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(userId);
    
    // Update the user's role
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: { role } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Not Found', 
        message: `User with ID ${userId} not found`
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'User role updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: 'Failed to update user role: ' + error.message
    });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collectionName = await getUsersCollection(db);
    const collection = db.collection(collectionName);
    
    const userId = req.params.id;
    console.log(`Deleting user with ID ${userId}`);
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(userId);
    
    // Delete the user
    const result = await collection.deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Not Found', 
        message: `User with ID ${userId} not found`
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: 'Failed to delete user: ' + error.message
    });
  }
});

// Add new user
router.post('/users', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collectionName = await getUsersCollection(db);
    const collection = db.collection(collectionName);
    
    const userData = req.body;
    console.log('Creating new user with data:', userData);
    
    // Prepare user data
    const newUser = {
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    // Insert the new user
    const result = await collection.insertOne(newUser);
    
    // Return the created user including the _id
    res.status(201).json({
      _id: result.insertedId,
      ...newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: 'Failed to create user: ' + error.message
    });
  }
});

module.exports = router; 