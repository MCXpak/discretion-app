const e = require('express');
const db = require('../database/connect');

class Post {

    constructor({ post_id, title, content, sender_id, username, recipient_id, recipient, date_created }) {
        this.id = post_id;
        this.title = title;
        this.content = content;
        this.sender_id = sender_id;
        this.sender_name = username;
        this.recipient_id = recipient_id;
        this.recipient = recipient;
        this.date_created = date_created;
    }

    static async getAll(id=null) {
        if (!id){
            const response = await db.query("SELECT * FROM post JOIN user_account ON post.sender_id = user_account.user_id");
            return response.rows.map(p => new Post(p));
        } else {
            const response = await db.query("SELECT * FROM post JOIN user_account ON post.sender_id = user_account.user_id WHERE recipient_id = $1", [id]);
            return response.rows.map(p => new Post(p));
        }
        
        
    }

    static async getOneById(id) {
        const response = await db.query("SELECT * FROM post JOIN user_account ON post.sender_id = user_account.user_id WHERE post_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate post.")
        }
        console.log(response.rows[0])
        return new Post(response.rows[0]);
    }

    static async create(data) {
        const {title, content, sender_id, recipient_id} = data;
        const date_created = new Date().toDateString()
        let response = await db.query("INSERT INTO post (title, content, sender_id, recipient_id, date_created) VALUES ($1, $2, $3, $4, $5) RETURNING post_id;",
            [title, content, sender_id, recipient_id, date_created]);
        const newId = response.rows[0].post_id;
        const newPost = await Post.getOneById(newId);
        return newPost;
    }

    async destroy() {
        let response = await db.query("DELETE FROM post WHERE post_id = $1 RETURNING *;", [this.id]);
        return new Post(response.rows[0]);
    }

}

module.exports = Post;
