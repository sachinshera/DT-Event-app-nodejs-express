const db = require('../database');
const { v4: uuidv4 } = require('uuid');
var ObjectId = require('mongodb').ObjectId;
const addEvent = async (req, res) => {
    // check all fileds are present
    if (!req.body.name || !req.body.tagline || !req.body.schedule || !req.body.moderator || !req.body.category || !req.body.sub_category || !req.body.rigor_rank) {
        return res.status(400).json({
            message: "All fields are required"
        });
    } else {
        // insert into database
        const eventCollection = db.collection('events');
        let currentUUid = uuidv4();
        const event = {
            type: "event",
            uuid: currentUUid,
            name: req.body.name,
            tagline: req.body.tagline,
            schedule: req.body.schedule,
            moderator: req.body.moderator,
            category: req.body.category,
            sub_category: req.body.sub_category,
            rigor_rank: req.body.rigor_rank,
            filepath: "uploads/" + currentUUid + "/" + req.files[0].originalname
        }

        try {
            const result = await eventCollection.insertOne(event);
            // after instered store the file in the file system
            const file = req.files[0];
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, `../uploads/${event.uuid}`);
            fs.mkdirSync(filePath);
            fs.writeFileSync(path.join(filePath, file.originalname), file.buffer);
            res.status(200).json({
                message: "Event added successfully",
                result: result
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: "Server error",
                error: e
            });
        }
    }
}

const updateEvent = async (req, res) => {
    // check all fileds are present
    if (!req.body.id || !req.body.name || !req.body.tagline || !req.body.schedule || !req.body.moderator || !req.body.category || !req.body.sub_category || !req.body.rigor_rank) {
        return res.status(400).json({
            message: "All fields are required"
        });
    } else {
        // insert into database
        const eventCollection = db.collection('events');
        // check uuid is exist in database
        var id = req.body.id;
        var obj_id = new ObjectId(id);
        const result = await eventCollection.findOne({ _id: obj_id });
        if (!result) {
            return res.status(400).json({
                message: "Invalid id"
            });
        } else {
            let currentUUid = result.uuid;
            const event = {
                type: "event",
                name: req.body.name,
                tagline: req.body.tagline,
                schedule: req.body.schedule,
                moderator: req.body.moderator,
                category: req.body.category,
                sub_category: req.body.sub_category,
                rigor_rank: req.body.rigor_rank,
                filepath: "uploads/" + currentUUid + "/" + req.files[0].originalname
            }
            try {
                const result = await eventCollection.updateOne({ id: req.body.id }, { $set: event });
                // after instered store the file in the file system
                const file = req.files[0];
                const fs = require('fs');
                const path = require('path');
                const filePath = path.join(__dirname, `../uploads/${currentUUid}`);
                fs.writeFileSync(path.join(filePath, file.originalname), file.buffer);
                res.status(200).json({
                    message: "Event updated successfully",
                    result: result
                });
            } catch (e) {
                console.log(e);
                res.status(500).json({
                    message: "Server error",
                    error: e
                });
            }
        }
    }
}

// get event by id

const getEventById = async (req, res) => {
    const eventCollection = db.collection('events');
    var id = req.params.id;
    var obj_id = new ObjectId(id);
    const result = await eventCollection.findOne({ _id: obj_id });
    if (!result) {
        return res.status(400).json({
            message: "Invalid id"
        });
    } else {
        res.status(200).json({
            message: "Event fetched successfully",
            result: result
        });
    }
}

const deleteEventByid = async (req, res) => {
    const eventCollection = db.collection('events');
    var id = req.params.id;
    var obj_id = new ObjectId(id);
    const result = await eventCollection.findOne({ _id: obj_id });
    if (!result) {
        return res.status(400).json({
            message: "Invalid id"
        });
    } else {
        const result = await eventCollection.deleteOne({ _id: obj_id });
        res.status(200).json({
            message: "Event deleted successfully",
            result: result
        });
    }
}

// Gets an event by its recency & paginate results by page number and limit of events per page
// if tyepe == lates then get latest events
const getEvents = async (req, res) => {
    const eventCollection = db.collection('events');
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const type = req.query.type;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    if (endIndex < await eventCollection.countDocuments()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    try {
        if (type == "latest") {
            results.results = await eventCollection.find().sort({ _id: -1 }).limit(limit).skip(startIndex).toArray();
        } else {
            results.results = await eventCollection.find().limit(limit).skip(startIndex).toArray();
        }
        res.status(200).json({
            message: "Events fetched successfully",
            results: results
        });
    } catch (e) {
        res.status(500).json({
            message: "Server error",
            error: e
        });
    }
}

module.exports = {
    addEvent: addEvent,
    updateEvent: updateEvent,
    getEventById: getEventById,
    deleteEventByid: deleteEventByid,
    getEvents: getEvents
}