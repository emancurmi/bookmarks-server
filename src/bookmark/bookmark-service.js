const BookmarkService = {

    getAllBookmarks(knex) {
        return knex.select('*').from('tbl_bookmarks')
    },

    insertBookmark(knex, newBookmark) {
        return knex
            .insert(newBookmark)
            .into('tbl_bookmarks')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('tbl_bookmarks').select('*').where('id', id).first()
    },

    deleteBookmark(knex, id) {
        return knex('tbl_bookmarks')
            .where({ id })
            .delete()
    },

    updateBookmark(knex, id, newBookmarkFields) {
        return knex('tbl_bookmarks')
            .where({ id })
            .update(newArticleFields)
    },
}

module.exports = BookmarkService