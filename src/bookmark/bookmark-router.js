const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('../store')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
    .route('/bookmark')
    .get((req, res) => {
        res.json(bookmarks);
    })
    .post(bodyParser, (req, res) => {
        console.log(req.body);
        const { title, url, desc, rating } = req.body

        for (const field of ['title', 'url', 'rating']) {
            if (!req.body[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send(`'${field}' is required`)
            }
        }

        if (Number(rating) < 0 || Number(rating) > 5) {
            console.log(Number(rating));
            logger.error(`Invalid rating '${rating}' supplied`)
            return res.status(400).send(`'rating' must be a number between 0 and 5`)
        }

        if (!url) {
            logger.error(`Url is required`);
            return res
                .status(400)
                .send('Invalid Url data');
        }

        if (!desc) {
            logger.error(`Description is required`);
            return res
                .status(400)
                .send('Invalid description data');
        }

        const id = uuid();

        const bookmark = {
            id,
            title,
            url,
            rating,
            desc
        };

        bookmarks.push(bookmark);

        logger.info(`bookmark with id ${id} created`);

        res
            .status(201)
            .location(`http://localhost:8000/bookmark/${id}`)
            .json(bookmark);
    })

bookmarkRouter
    .route('/bookmark/:id')
    .get((req, res) => {
        const { id } = req.params;
        const bookmark = bookmarks.find(c => c.id == id);

        // make sure we found a bookmark
        if (!bookmark) {
            logger.error(`bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('bookmark Not Found');
        }

        res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;

        const bookmarkIndex = bookmarks.findIndex(c => c.id == id);

        if (bookmarkIndex === -1) {
            logger.error(`bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Not found');
        }

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`bookmark with id ${id} deleted.`);
        
        res
            .status(204)
            .end();
    })

module.exports = bookmarkRouter