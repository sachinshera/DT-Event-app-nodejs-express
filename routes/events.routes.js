// use express router for routing 
const express = require('express');
const router = new express.Router();
const eventsControllers = require('../controllers/events.controllers');
router.post("/", (req, res) => {
    eventsControllers.addEvent(req, res);
});

router.put("/", (req, res) => {
    eventsControllers.updateEvent(req, res);
});

router.get("/:id", (req, res) => {
    eventsControllers.getEventById(req, res);
});

router.delete("/:id", (req, res) => {
    eventsControllers.deleteEventByid(req, res);
});

router.get("/", (req, res) => {
    eventsControllers.getEvents(req, res);
});

// export router

module.exports = router;