// Import the Express module
const express = require('express');
const app = express();
const port = 3001;

// Sample members data (in-memory database)
let members = [
  { id: 1, name: 'Aditya Chincholkar', age: 18, bs: 25000 },
  { id: 2, name: 'Rahul Sharma', age: 22, bs: 30000 }
];

// Middleware to parse incoming JSON requests
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Members REST API');
});

// POST: Create new member
app.post('/api/members', (req, res) => {
  const { name, age, bs } = req.body;

  // Validate input data
  if (!name || !age || !bs) {
    return res.status(400).json({ message: 'Name, age, and basic salary (bs) are required' });
  }

  // Generate a unique ID for the new member
  const newId = members.length > 0 ? Math.max(...members.map(member => member.id)) + 1 : 1;

  const newMember = {
    id: newId,
    name,
    age,
    bs
  };

  // Add the new member to the in-memory database
  members.push(newMember);

  res.status(201).json({ message: 'Member created successfully', newMember });
});

// GET: Retrieve all members
app.get('/api/members', (req, res) => {
  res.json(members);
});

// GET: Retrieve a member by ID
app.get('/api/members/:id', (req, res) => {
  const memberId = parseInt(req.params.id);

  // Validate if memberId is numeric
  if (isNaN(memberId)) {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  // Find the member by ID
  const member = members.find(m => m.id === memberId);

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.json(member);
});

// PUT: Update existing member
app.put('/api/members/:id', (req, res) => {
  const memberId = parseInt(req.params.id);

  // Validate if memberId is numeric
  if (isNaN(memberId)) {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  const memberIndex = members.findIndex(m => m.id === memberId);

  if (memberIndex === -1) {
    return res.status(404).json({ message: 'Member not found' });
  }

  // Update the member's details with the provided data
  members[memberIndex] = {
    ...members[memberIndex],
    name: req.body.name || members[memberIndex].name,
    age: req.body.age || members[memberIndex].age,
    bs: req.body.bs || members[memberIndex].bs
  };

  res.json({ message: 'Member updated successfully', member: members[memberIndex] });
});

// DELETE: Remove a member
app.delete('/api/members/:id', (req, res) => {
  const memberId = parseInt(req.params.id);

  // Validate if memberId is numeric
  if (isNaN(memberId)) {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  const memberIndex = members.findIndex(m => m.id === memberId);

  if (memberIndex === -1) {
    return res.status(404).json({ message: 'Member not found' });
  }

  // Remove the member from the array
  members.splice(memberIndex, 1);

  res.json({ message: 'Member deleted successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
