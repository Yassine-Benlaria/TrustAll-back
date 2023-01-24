const Blog = require("../models/blog");

//getBlogs
exports.getBlogs = (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err || !blogs) {
            console.log(err)
            return res.status(400).json({ err: "err" })
        }
        return res.json(blogs);
    })
}

//get blog by id
exports.getBlogById = (req, res) => {
    Blog.findOne({ _id: req.params.blog_id }, (err, blog) => {
        if (err || !blog) {
            return res.status(400).json({ err: "no blog found!" });
        }
        return res.json(blog);
    })
}

//delete blog
exports.deleteBlog = (req, res) => {
    Blog.findByIdAndDelete(req.params.blog_id, (err, deleted) => {
        if (err) {
            console.log(err)
        }
        return res.json({ msg: "deleted succefully!!" })
    })
}