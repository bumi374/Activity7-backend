
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
const recordsRouter = require('./routes/records');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/records', (req, res, next) => {
    console.log('API REQUEST:', req.method, req.originalUrl);
    next();
}, recordsRouter);


app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>IT Support Desk API Guide</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 850px;
                    margin: 40px auto;
                    padding: 20px;
                    background: #f4f6f9;
                    color: #222;
                }

                h1 {
                    color: #17365d;
                }

                .endpoint {
                    background: white;
                    padding: 15px;
                    margin: 12px 0;
                    border-radius: 6px;
                    border-left: 5px solid #17365d;
                }

                code {
                    font-weight: bold;
                    color: #17365d;
                }
            </style>
        </head>
        <body>
            <h1>IT Support Desk API</h1>
            <p>Welcome to the IT Support Desk REST API.</p>

            <h2>Available Endpoints</h2>

            <div class="endpoint">
                <code>GET /health</code>
                <p>Check the API and database connection.</p>
            </div>

            <div class="endpoint">
                <code>GET /api/records</code>
                <p>Retrieve all support records.</p>
            </div>

            <div class="endpoint">
                <code>GET /api/records/:id</code>
                <p>Retrieve one support record by ID.</p>
            </div>

            <div class="endpoint">
                <code>POST /api/records</code>
                <p>Create a new support record.</p>
            </div>

            <div class="endpoint">
                <code>PUT /api/records/:id</code>
                <p>Update an existing support record.</p>
            </div>

            <div class="endpoint">
                <code>DELETE /api/records/:id</code>
                <p>Delete a support record.</p>
            </div>
        </body>
        </html>
    `);
});


// Health check route
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');

        res.status(200).json({
            status: 'OK',
            database: 'Connected'
        });
    } catch (error) {
        res.status(503).json({
            status: 'Error',
            database: 'Disconnected'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
