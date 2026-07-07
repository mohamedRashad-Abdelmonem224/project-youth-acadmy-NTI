require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Player = require('../models/player.model');

const serviceFilePath = path.resolve(__dirname, '..', '..', 'youth-academy-angular', 'src', 'app', 'services', 'player.service.ts');

function extractArray(content, name) {
  const regex = new RegExp(`const ${name}:\\s*string\\[\\]\\s*=\\s*\\[(.*?)\\];`, 's');
  const match = content.match(regex);
  if (!match) return [];
  return Array.from(match[1].matchAll(/'([^']*)'/g)).map((m) => m[1]);
}

function extractSpecialNames(content) {
  const regex = /const SPECIAL_NAMES = \[(.*?)\];/s;
  const match = content.match(regex);
  if (!match) return [];
  return Array.from(match[1].matchAll(/'([^']*)'/g)).map((m) => m[1]);
}

function buildPlayers(names, specialNames) {
  const positions = ['ST', 'CM', 'CB', 'GK', 'RB'];
  const teamOverrides = {
    'حمزة عبد الكريم': 'Barcelona',
    'بلال عطيه': 'Alahly',
    'محمد هيثم': 'National Portugal',
    'إبراهيم عادل': 'Alahly',
    'محمد ابراهيم': 'Zamalek',
    'كريم احمد': 'Liverpool',
    'عمرو بيبو': 'aurawa',
    'مالك اسامه': 'smouha',
  };
  const positionOverrides = {
    'مالك اسامه': 'GK',
  };

  return names.map((name, index) => ({
    name,
    team: teamOverrides[name] || 'Youth Academy',
    position: positionOverrides[name] || positions[index % positions.length],
    img: '',
    video: '',
    stats: {
      goals: Math.floor(Math.random() * 18),
      assists: Math.floor(Math.random() * 12),
      matches: 20 + Math.floor(Math.random() * 15),
      injuries: Math.floor(Math.random() * 3),
    },
    rating: [60 + (index % 7), 63 + (index % 9), 66 + (index % 11), 70 + (index % 13), 75 + (index % 17)],
    status: specialNames.includes(name) ? 'approved' : 'pending',
  }));
}

async function seed() {
  if (!fs.existsSync(serviceFilePath)) {
    throw new Error(`Could not find Angular service file at ${serviceFilePath}`);
  }

  const content = fs.readFileSync(serviceFilePath, 'utf8');
  const names = extractArray(content, 'NAMES');
  const specialNames = extractSpecialNames(content);

  if (!names.length) {
    throw new Error('No player names were found in the Angular service file.');
  }

  const players = buildPlayers(names, specialNames);

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Please add it to your .env file.');
  }

  await mongoose.connect(mongoUri, { dbName: process.env.DB_NAME || 'youthacadmy' });
  console.log('Connected to MongoDB Atlas');

  await Player.deleteMany({ name: { $in: names } });
  const inserted = await Player.insertMany(players);

  console.log(`Inserted ${inserted.length} players into MongoDB Atlas`);
  await mongoose.disconnect();
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exit(1);
  });
