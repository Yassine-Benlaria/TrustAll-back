const Blog = require("../models/blog");

exports.getBlogs = (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err || !blogs) {
            console.log(err)
            return res.status(400).json({ err: "err" })
        }
        return res.json(blogs);
    })
}