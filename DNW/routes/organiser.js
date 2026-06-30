/**
 * organiser.js - Routes for Organiser pages
 * Includes authentication middleware to protect routes
 */
const express = require('express');
const router = express.Router();

/**
 * GET /organiser
 * Purpose: Display organiser home page with draft & published events
 * Inputs: None
 * Outputs: Renders organiser-home.ejs with settings, drafts, published events
 */
router.get('/', (req, res, next) => {
    const settingsQuery = 'SELECT site_name, site_description FROM settings WHERE id = 1';

    // Published events with total tickets count
    const publishedQuery = `
        SELECT e.*,
               (SELECT SUM(quantity_available) FROM ticket_types WHERE event_id = e.event_id) AS total_tickets
        FROM events e
        WHERE e.status = 'published'
        ORDER BY e.event_date DESC
    `;

    // Draft events
    const draftQuery = `
        SELECT e.*,
               (SELECT SUM(quantity_available) FROM ticket_types WHERE event_id = e.event_id) AS total_tickets
        FROM events e
        WHERE e.status = 'draft'
        ORDER BY e.created_at DESC
    `;

    global.db.get(settingsQuery, (err, settings) => {
        if (err) return next(err);
        global.db.all(publishedQuery, (err, published) => {
            if (err) return next(err);
            global.db.all(draftQuery, (err, drafts) => {
                if (err) return next(err);
                res.render('organiser-home', { settings, published, drafts });
            });
        });
    });
});

/**
 * GET /organiser/settings
 * Purpose: Display settings form populated with current site name & description
 */
router.get('/settings', (req, res, next) => {
    global.db.get('SELECT site_name, site_description FROM settings WHERE id = 1', (err, settings) => {
        if (err) return next(err);
        res.render('organiser-settings', { settings });
    });
});

/**
 * POST /organiser/settings
 * Purpose: Update site settings
 * Inputs: site_name, site_description (form)
 * Outputs: Redirects to /organiser
 */
router.post('/settings', (req, res, next) => {
    const { site_name, site_description } = req.body;
    if (!site_name || !site_description) {
        // In a real app, re-render with error. For simplicity, redirect back.
        return res.redirect('/organiser/settings');
    }
    const query = 'UPDATE settings SET site_name = ?, site_description = ? WHERE id = 1';
    global.db.run(query, [site_name, site_description], (err) => {
        if (err) return next(err);
        res.redirect('/organiser');
    });
});

/**
 * GET /organiser/event/new
 * Purpose: Create a new draft event and redirect to its edit page
 */
router.get('/event/new', (req, res, next) => {
    const query = `INSERT INTO events (title, description, event_date) VALUES ('New Event', 'Description', date('now'))`;
    global.db.run(query, function(err) {
        if (err) return next(err);
        const newEventId = this.lastID;
        // Create default ticket types (Full & Concession)
        const ticketQueries = [
            `INSERT INTO ticket_types (event_id, type_name, price, quantity_available) VALUES (?, 'Full', 10.00, 50)`,
            `INSERT INTO ticket_types (event_id, type_name, price, quantity_available) VALUES (?, 'Concession', 5.00, 20)`
        ];
        global.db.run(ticketQueries[0], [newEventId], (err) => {
            if (err) return next(err);
            global.db.run(ticketQueries[1], [newEventId], (err) => {
                if (err) return next(err);
                res.redirect(`/organiser/event/${newEventId}`);
            });
        });
    });
});

/**
 * GET /organiser/event/:id
 * Purpose: Display edit form for a specific event (populated with data)
 * Inputs: event_id (URL param)
 * Outputs: Renders organiser-edit.ejs
 */
router.get('/event/:id', (req, res, next) => {
    const eventId = req.params.id;
    const eventQuery = 'SELECT * FROM events WHERE event_id = ?';
    const ticketsQuery = 'SELECT * FROM ticket_types WHERE event_id = ?';

    global.db.get(eventQuery, [eventId], (err, event) => {
        if (err) return next(err);
        if (!event) return res.status(404).send('Event not found');

        global.db.all(ticketsQuery, [eventId], (err, tickets) => {
            if (err) return next(err);
            // Ensure we have exactly 2 tickets (Full/Concession) for the form
            const fullTicket = tickets.find(t => t.type_name === 'Full') || { ticket_type_id: null, price: 0, quantity_available: 0 };
            const concessionTicket = tickets.find(t => t.type_name === 'Concession') || { ticket_type_id: null, price: 0, quantity_available: 0 };
            res.render('organiser-edit', { event, fullTicket, concessionTicket });
        });
    });
});

/**
 * POST /organiser/event/:id
 * Purpose: Update event details and ticket info. Updates last_modified timestamp.
 * Inputs: title, description, event_date, full_price, full_qty, conc_price, conc_qty
 * Outputs: Redirects to /organiser
 */
router.post('/event/:id', (req, res, next) => {
    const eventId = req.params.id;
    const { title, description, event_date, full_price, full_qty, conc_price, conc_qty } = req.body;

    // Validate inputs (server-side)
    if (!title || !description || !event_date || full_price === undefined || full_qty === undefined) {
        return res.status(400).send('All fields are required.');
    }

    // 1. Update event
    const updateEvent = `UPDATE events SET title = ?, description = ?, event_date = ?, last_modified = CURRENT_TIMESTAMP WHERE event_id = ?`;
    global.db.run(updateEvent, [title, description, event_date, eventId], function(err) {
        if (err) return next(err);

        // 2. Update ticket types (Full)
        const updateFull = `UPDATE ticket_types SET price = ?, quantity_available = ? WHERE event_id = ? AND type_name = 'Full'`;
        global.db.run(updateFull, [parseFloat(full_price), parseInt(full_qty), eventId], (err) => {
            if (err) return next(err);

            // 3. Update ticket types (Concession)
            const updateConc = `UPDATE ticket_types SET price = ?, quantity_available = ? WHERE event_id = ? AND type_name = 'Concession'`;
            global.db.run(updateConc, [parseFloat(conc_price), parseInt(conc_qty), eventId], (err) => {
                if (err) return next(err);
                res.redirect('/organiser');
            });
        });
    });
});

/**
 * POST /organiser/event/:id/publish
 * Purpose: Publish a draft event (set status and published_at timestamp)
 */
router.post('/event/:id/publish', (req, res, next) => {
    const eventId = req.params.id;
    const query = `UPDATE events SET status = 'published', published_at = CURRENT_TIMESTAMP WHERE event_id = ?`;
    global.db.run(query, [eventId], (err) => {
        if (err) return next(err);
        res.redirect('/organiser');
    });
});

/**
 * POST /organiser/event/:id/delete
 * Purpose: Delete an event (cascade deletes tickets and bookings due to FK)
 */
router.post('/event/:id/delete', (req, res, next) => {
    const eventId = req.params.id;
    const query = `DELETE FROM events WHERE event_id = ?`;
    global.db.run(query, [eventId], (err) => {
        if (err) return next(err);
        res.redirect('/organiser');
    });
});

module.exports = router;