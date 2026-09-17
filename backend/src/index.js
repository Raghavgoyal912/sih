import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import searchRouter from './routes/search.js';
import documentsRouter from './routes/documents.js';
import geodataRouter from './routes/geodata.js';
import simulateRouter from './routes/simulate.js';
import workspacesRouter from './routes/workspaces.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/search', searchRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/geodata', geodataRouter);
app.use('/api/simulate', simulateRouter);
app.use('/api/workspaces', workspacesRouter);

// Central error handler — every route below calls next(err) on failure
// so errors always come back as consistent JSON instead of crashing.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`BhoomiSetu backend running on http://localhost:${PORT}`);
});
