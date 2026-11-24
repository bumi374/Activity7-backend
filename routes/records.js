
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all support records
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM records ORDER BY id ASC'
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error fetching records:', error.message);

        res.status(500).json({
            message: 'Failed to retrieve records'
        });
    }
});
// GET a single support record by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM records WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Record not found'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching record:', error.message);

        res.status(500).json({
            message: 'Failed to retrieve record'
        });
    }
});

// POST a new support record
router.post('/', async (req, res) => {
    try {
        const { title, category, description, status } = req.body || {};

        // Validate the input fields
        if (
            typeof title !== 'string' ||
            title.trim().length < 3 ||
            title.trim().length > 80 ||
            typeof category !== 'string' ||
            category.trim().length < 2 ||
            category.trim().length > 40 ||
            typeof description !== 'string' ||
            description.trim().length < 5 ||
            description.trim().length > 300 ||
            !['Pending', 'In progress', 'Completed'].includes(status)
        ) {
            return res.status(400).json({
                message: 'Invalid record details. Please check all fields.'
            });
        }

        if ('id' in req.body) {
            return res.status(400).json({
                message: 'Record ID is generated automatically.'
            });
        }

        const result = await pool.query(
            `INSERT INTO records (title, category, description, status)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                title.trim(),
                category.trim(),
                description.trim(),
                status
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error creating record:', error.message);

        res.status(500).json({
            message: 'Failed to create record'
        });
    }
});


// PUT - Update an existing support record
console.log('PUT route is being loaded');
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description, status } = req.body || {};

        // Validate the input fields
        if (
            typeof title !== 'string' ||
            title.trim().length < 3 ||
            title.trim().length > 80 ||
            typeof category !== 'string' ||
            category.trim().length < 2 ||
            category.trim().length > 40 ||
            typeof description !== 'string' ||
            description.trim().length < 5 ||
            description.trim().length > 300 ||
            !['Pending', 'In progress', 'Completed'].includes(status)
        ) {
            return res.status(400).json({
                message: 'Invalid record details. Please check all fields.'
            });
        }

        if ('id' in req.body) {
            return res.status(400).json({
                message: 'Record ID cannot be changed.'
            });
        }

        const result = await pool.query(
            `UPDATE records
             SET title = $1,
                 category = $2,
                 description = $3,
                 status = $4
             WHERE id = $5
             RETURNING *`,
            [
                title.trim(),
                category.trim(),
                description.trim(),
                status,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Record not found'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error updating record:', error.message);

        res.status(500).json({
            message: 'Failed to update record'
        });
    }
});

 // DELETE - Remove an existing support record
router.delete('/:id', async (req, res) => {
    console.log('DELETE route reached:', req.params.id);
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid record ID'
            });
        }

        const result = await pool.query(
            'DELETE FROM records WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Record not found'
            });
        }

        res.status(200).json({
            message: 'Record deleted successfully',
            record: result.rows[0]
        });

    } catch (error) {
        console.error('Error deleting record:', error.message);

        res.status(500).json({
            message: 'Failed to delete record'
        });
    }
});

module.exports = router;