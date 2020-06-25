const BookmarkService = {
    getAllBookmarks(knex) {
        return knex.select('*').from('blogful_articles')
    },
    insertBookmark(knex, newBookmark) {
        return knex
            .insert(newBookmark)
            .into('bookmarks')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('bookmarks').select('*').where('id', id).first()
    },
    deleteBookmark(knex, id) {
        return knex('bookmarks')
            .where({ id })
            .delete()
    },
    updateBookmark(knex, id, newBookmarkFields) {
        return knex('bookmarks')
            .where({ id })
            .update(newArticleFields)
    },
}

module.exports = BookmarkService