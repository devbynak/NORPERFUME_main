require('dotenv').config();
const app = require('./api/index');
const PORT = process.env.PORT || 3000;

/**
 * LOCAL DEVELOPMENT SERVER
 * In Vercel (Production), the app is automatically 
 * wrapped in a Serverless Function via api/index.js.
 */
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`✅ NOR Perfume Local Dev running on http://localhost:${PORT}`);
    });
}

