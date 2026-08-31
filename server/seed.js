require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Complaint = require('./models/Complaint');

const categories = ['Road', 'Garbage', 'Water', 'Electricity', 'Other'];
const areas = ['Sector G-9', 'Block D', 'North Town', 'Riverside', 'Old City'];
const statuses = ['Pending', 'In Progress', 'Resolved'];
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const complaintTitles = [
  'Large pothole on main road', 'Garbage not collected for a week', 'Streetlight not working',
  'Water supply disrupted', 'Broken drainage cover', 'Overflowing dustbin near market',
  'Frequent power cuts', 'Damaged footpath', 'Illegal dumping near park', 'Low water pressure',
  'Transformer sparking at night', 'Sewage leak on street', 'Traffic signal malfunction',
  'Stray animal issue near school', 'Road flooding after rain',
];

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany({}), Complaint.deleteMany({})]);

  console.log('Creating users...');
  const officer1 = await User.create({ name: 'Officer Khan', email: 'officer@portal.gov', password: 'password123', role: 'officer' });
  const officer2 = await User.create({ name: 'Officer Ahmed', email: 'officer2@portal.gov', password: 'password123', role: 'officer' });

  const citizens = [];
  for (let i = 1; i <= 8; i++) {
    citizens.push(await User.create({
      name: `Citizen ${i}`, email: `citizen${i}@example.com`, password: 'password123', role: 'citizen', area: randomFrom(areas),
    }));
  }

  console.log('Creating complaints...');
  for (let i = 0; i < complaintTitles.length; i++) {
    const daysAgo = Math.floor(Math.random() * 20);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const status = randomFrom(statuses);
    const upvotes = Math.floor(Math.random() * 15);
    const citizen = randomFrom(citizens);

    const complaint = await Complaint.create({
      title: complaintTitles[i],
      description: `Reported issue: ${complaintTitles[i].toLowerCase()}. Needs attention from the concerned department.`,
      category: randomFrom(categories),
      area: randomFrom(areas),
      status,
      upvotes,
      upvotedBy: citizens.slice(0, Math.min(upvotes, citizens.length)).map((c) => c._id),
      createdBy: citizen._id,
      officerRemark: status !== 'Pending' ? 'Team has been notified and is reviewing the issue.' : '',
      createdAt,
      statusUpdatedAt: createdAt,
      feedbackPending: status === 'Resolved' && Math.random() > 0.5,
      feedbackGiven: status === 'Resolved' && Math.random() > 0.6,
      feedbackRating: status === 'Resolved' && Math.random() > 0.6 ? Math.ceil(Math.random() * 5) : undefined,
    });
    // fix createdAt (Mongoose timestamps override on create, so patch directly)
    await Complaint.updateOne({ _id: complaint._id }, { createdAt, statusUpdatedAt: createdAt });
  }

  console.log('\nSeed complete!');
  console.log('----------------------------------------');
  console.log('Demo credentials (password: password123)');
  console.log('  Officer: officer@portal.gov');
  console.log('  Citizen: citizen1@example.com');
  console.log('----------------------------------------');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
