/**
 * attendee.js - Routes for Attendee pages (Fixed booking)
 */
const express = require('express');
const router = express.Router();

/**
 * GET /attendee
 */
router.get('/', (req, res, next) => {
    const settingsQuery = 'SELECT site_name, site_description FROM settings WHERE id = 1';
    const eventsQuery = `
        SELECT event_id, title, event_date, description
        FROM events
        WHERE status = 'published'
        ORDER BY event_date ASC
    `;

    global.db.get(settingsQuery, (err, settings) => {
        if (err) return next(err);
        global.db.all(eventsQuery, (err, events) => {
            if (err) return next(err);
            res.render('attendee-home', { settings, events });
        });
    });
});

/**
 * GET /attendee/event/:id
 */
router.get('/event/:id', (req, res, next) => {
    const eventId = req.params.id;
    const eventQuery = 'SELECT * FROM events WHERE event_id = ? AND status = "published"';
    const ticketsQuery = 'SELECT * FROM ticket_types WHERE event_id = ?';

    global.db.get(eventQuery, [eventId], (err, event) => {
        if (err) return next(err);
        if (!event) return res.status(404).send('Event not found or not published');

        global.db.all(ticketsQuery, [eventId], (err, tickets) => {
            if (err) return next(err);
            const success = req.query.success === 'true';
            res.render('attendee-event', { event, tickets, success, error: null });
        });
    });
});

/**
 * POST /attendee/event/:id/book
 */
router.post('/event/:id/book', (req, res, next) => {
    const eventId = req.params.id;
    const { attendee_name } = req.body;

    // Helper to re-render with error
    function renderWithError(errorMsg, callback) {
        const eventQuery = 'SELECT * FROM events WHERE event_id = ? AND status = "published"';
        const ticketsQuery = 'SELECT * FROM ticket_types WHERE event_id = ?';
        global.db.get(eventQuery, [eventId], (err, event) => {
            if (err) return callback(err);
            global.db.all(ticketsQuery, [eventId], (err, tickets) => {
                if (err) return callback(err);
                return res.render('attendee-event', { 
                    event, 
                    tickets, 
                    success: false, 
                    error: errorMsg 
                });
            });
        });
    }

    // 1. Validate attendee name
    if (!attendee_name || attendee_name.trim() === '') {
        return renderWithError('Attendee name is required.', next);
    }

    // 2. Parse ticket quantities from the form (fields like ticket_qty_1, ticket_qty_2)
    const bookings = [];
    for (const [key, value] of Object.entries(req.body)) {
        if (key.startsWith('ticket_qty_')) {
            const ticketId = parseInt(key.replace('ticket_qty_', ''), 10);
            const qty = parseInt(value, 10);
            if (!isNaN(ticketId) && !isNaN(qty) && qty > 0) {
                bookings.push({ ticket_type_id: ticketId, quantity: qty });
            }
        }
    }

    if (bookings.length === 0) {
        return renderWithError('You must select at least one ticket.', next);
    }

    // 3. Start DB Transaction
    global.db.run('BEGIN TRANSACTION', (err) => {
        if (err) return next(err);

        let processed = 0;
        const total = bookings.length;

        function processNext() {
            if (processed >= total) {
                global.db.run('COMMIT', (err) => {
                    if (err) return next(err);
                    return res.redirect(`/attendee/event/${eventId}?success=true`);
                });
                return;
            }

            const { ticket_type_id, quantity } = bookings[processed];

            // Check availability (and ensure ticket belongs to this event)
            global.db.get(
                'SELECT quantity_available FROM ticket_types WHERE ticket_type_id = ? AND event_id = ?',
                [ticket_type_id, eventId],
                (err, row) => {
                    if (err) {
                        global.db.run('ROLLBACK');
                        return next(err);
                    }
                    if (!row) {
                        global.db.run('ROLLBACK');
                        return renderWithError(
                            `Ticket type not found for this event.`,
                            next
                        );
                    }
                    if (row.quantity_available < quantity) {
                        global.db.run('ROLLBACK');
                        return renderWithError(
                            `Not enough tickets available. Only ${row.quantity_available} left.`,
                            next
                        );
                    }

                    // Reduce stock
                    global.db.run(
                        'UPDATE ticket_types SET quantity_available = quantity_available - ? WHERE ticket_type_id = ?',
                        [quantity, ticket_type_id],
                        function(err) {
                            if (err) {
                                global.db.run('ROLLBACK');
                                return next(err);
                            }

                            // Insert booking
                            global.db.run(
                                `INSERT INTO bookings (event_id, attendee_name, ticket_type_id, quantity)
                                 VALUES (?, ?, ?, ?)`,
                                [eventId, attendee_name, ticket_type_id, quantity],
                                function(err) {
                                    if (err) {
                                        global.db.run('ROLLBACK');
                                        return next(err);
                                    }
                                    processed++;
                                    processNext();
                                }
                            );
                        }
                    );
                }
            );
        }

        processNext();
    });
});

module.exports = router;
