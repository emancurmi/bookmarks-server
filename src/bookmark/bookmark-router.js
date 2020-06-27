const express = require('express')
const xss = require('xss')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
//const { bookmarks } = require('../store')
const BookmarkService = require('./bookmark-service')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarkService.getAllBookmarks(knexInstance)
            .then(bookmarks => {
                res.json(bookmarks);
            })
        .catch(next)
    })

    .post(bodyParser, (req, res) => {
        console.log(req.body);
        const { title, url, desc, rating } = req.body
        const newBookmark = { title, url, desc, rating }

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

        BookmarkService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {

                logger.info(`bookmark with id ${id} created`);

                res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    .json(article)
            })
            .catch(next)

    })

bookmarkRouter
    .route('/bookmark/:id')

    .all((req, res, next) => {
        BookmarkService.getById(
            req.app.get('db'),
            req.params.article_id
        )
            .then(bookmark => {
                if (!bookmark) {
                    return res.status(404).json({
                        error: { message: `Bookmark doesn't exist` }
                    })
                }
                res.bookmark = bookmark 
                next() 
            })
            .catch(next)
    })

    .get((req, res, next) => {
        res.json({
            id: res.bookmark.id,
            title: xss(res.bookmark.title),
            url: res.bookmark.url, 
            rating: res.bookmark.rating,
            desc: xss(res.bookmark.desc),
        })
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