import express from 'express';
import cors from 'cors';
import {createUser} from "./handlers/users.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Example endpoint
app.post('/api/users', createUser);

// Vercel requires this export
export default app;
