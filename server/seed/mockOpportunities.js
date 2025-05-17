// FILE: server/seed/mockOpportunities.js

const mongoose = require('mongoose');
require('dotenv').config();

const Opportunity = require('../models/Opportunity');

const mockSponseeId = '680a141c940a64799ece2543'; // insert a valid Sponsee _id here

const mockOpportunities = [
  {
    title: "Beach Cleanup - Presented by YOU?",
    category: "Environment",
    tagline: "Make your brand shine while saving the shorelines.",
    description:
      "Join 1,000+ volunteers at our annual coastal cleanup. Be the brand that supports sustainability and ocean health.",
    sponsorshipLevels: [
      {
        level: "Presenting Sponsor",
        amount: 20000,
        benefits: "Logo on all signage, logo on cleanup buckets, branded water bottles for volunteers",
      },
      {
        level: "Towel Sponsor",
        amount: 5000,
        benefits: "Branded sustainable towels given to all participants",
      },
      {
        level: "Hat Sponsor",
        amount: 3500,
        benefits: "Branded giveaway hats for volunteers",
      },
    ],
    sponseeId: mockSponseeId,
  },
  {
    title: "Sunset Sounds Music Festival",
    category: "Events",
    tagline: "Put your name on the biggest stage of the season.",
    description:
      "Sponsor this mid-to-large scale event with over 10,000 attendees, media coverage, and high-profile musical acts.",
    sponsorshipLevels: [
      {
        level: "Presenting Sponsor",
        amount: 100000,
        benefits:
          "Naming rights, logo throughout event, 5 VIP tickets, branded t-shirts & hats, press release inclusion",
      },
    ],
    sponseeId: mockSponseeId,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    await Opportunity.deleteMany({});
    console.log('Cleared existing opportunities');

    await Opportunity.insertMany(mockOpportunities);
    console.log('Mock opportunities seeded');

    process.exit();
  } catch (err) {
    console.error('Error seeding opportunities:', err);
    process.exit(1);
  }
};

seedData();
