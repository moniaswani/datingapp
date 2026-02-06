import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import db from './db.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5174;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const normalizeProfileInput = (input) => {
  const profile = {
    id: input.id ?? `p_${nanoid(8)}`,
    name: isNonEmptyString(input.name) ? input.name.trim() : null,
    age: Number.isFinite(input.age) ? input.age : Number.parseInt(input.age, 10),
    location: isNonEmptyString(input.location) ? input.location.trim() : null,
    pitchedBy: isNonEmptyString(input.pitchedBy) ? input.pitchedBy.trim() : null,
    mainPhoto: isNonEmptyString(input.mainPhoto) ? input.mainPhoto.trim() : null,
    photos: Array.isArray(input.photos) ? input.photos : [],
    pitch: isNonEmptyString(input.pitch) ? input.pitch.trim() : '',
    interests: Array.isArray(input.interests) ? input.interests : [],
    funFact: isNonEmptyString(input.funFact) ? input.funFact.trim() : '',
    stickers: Array.isArray(input.stickers) ? input.stickers : [],
    createdAt: input.createdAt ?? new Date().toISOString()
  };

  return profile;
};

const validateProfile = (profile) => {
  const errors = [];
  if (!isNonEmptyString(profile.name)) errors.push('name is required');
  if (!Number.isFinite(profile.age) || profile.age <= 0) errors.push('age must be a positive number');
  if (!isNonEmptyString(profile.location)) errors.push('location is required');
  if (!isNonEmptyString(profile.pitchedBy)) errors.push('pitchedBy is required');
  if (!isNonEmptyString(profile.mainPhoto)) errors.push('mainPhoto is required');
  return errors;
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/profiles', async (_req, res) => {
  await db.read();
  res.json({ profiles: db.data.profiles });
});

app.get('/api/profiles/:id', async (req, res) => {
  await db.read();
  const profile = db.data.profiles.find((item) => item.id === req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  return res.json({ profile });
});

app.post('/api/profiles', async (req, res) => {
  const profile = normalizeProfileInput(req.body ?? {});
  const errors = validateProfile(profile);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Invalid profile', details: errors });
  }

  await db.read();
  db.data.profiles.unshift(profile);
  await db.write();

  return res.status(201).json({ profile });
});

app.post('/api/profiles/:id/like', async (req, res) => {
  await db.read();
  const profile = db.data.profiles.find((item) => item.id === req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  const like = {
    id: `like_${nanoid(8)}`,
    profileId: profile.id,
    createdAt: new Date().toISOString()
  };

  db.data.likes.unshift(like);
  await db.write();

  return res.json({ liked: true, like });
});

app.post('/api/profiles/:id/pass', async (req, res) => {
  await db.read();
  const profile = db.data.profiles.find((item) => item.id === req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  const pass = {
    id: `pass_${nanoid(8)}`,
    profileId: profile.id,
    createdAt: new Date().toISOString()
  };

  db.data.passes.unshift(pass);
  await db.write();

  return res.json({ passed: true, pass });
});

app.get('/api/stats', async (_req, res) => {
  await db.read();
  res.json({
    totalProfiles: db.data.profiles.length,
    totalLikes: db.data.likes.length,
    totalPasses: db.data.passes.length
  });
});

app.listen(PORT, () => {
  console.log(`Idea2 backend listening on http://localhost:${PORT}`);
});
