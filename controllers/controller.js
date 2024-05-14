//Tất cả các xử lý sẽ nằm trong đây
const controller = {}
const { where } = require('sequelize');
const models = require('../models');
//xử lý cho trang chủ
controller.blogs = async (req, res) => {
    // lay du lieu tu query string
    const category = req.query.category || '';    //search by category
    const tag = req.query.tag || '';              //search by tag
    const keyword = req.query.keyword || '';      //search by keyword
    const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page)); //pagination

    const sequelize = require('sequelize');
    const Op = sequelize.Op;

    const Blog = models.Blog;
    const options = {
        attributes: ['id', 'title', 'imagePath', 'summary'],
        where:{}
    };

    if (category.trim() !== '') {
        const exact_category = await models.Category.findOne(
            {
                where : { name : category}
            }
        );

        options.where.categoryId = exact_category.id;    
    }

    if (tag.trim() !== ''){
        const blog_with_tags = await Blog.findAll(
            {
                include: [
                    {
                        model: models.Tag,
                        where: {
                            name: tag
                        }
                    }
                ]
            }
        )

        let blog_ids = [];
        for (let i = 0; i < blog_with_tags.length; i++){
            blog_ids.push(blog_with_tags[i].id);
        }
        options.where.id = blog_ids;
    }

    if (keyword.trim() !== ''){
        options.where.title = {
            [Op.iLike]: `%${keyword}%`
        }
    }

    const limit = 2;
    const offset = (page - 1) * limit;
    options.limit = limit;
    options.offset = offset;

    res.locals.pagination = {
        page: page,
        limit: limit,
        totalRows: 6,
        queryParams: req.query
    }
    const blogs = await Blog.findAll(options);

    res.locals.blogs = blogs;
    res.render('index');    //lấy nội dung của file index.hbs đổ vào body trong layout.hbs
}

//xử lý cho /:id
controller.blog_detail = async (req, res) => {
    const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    const Blog = models.Blog;
    const User = models.User;
    res.locals.blog = null;
    res.locals.author = null;

    let blog = await Blog.findOne({
        attributes:['id', 'title', 'imagePath', 'description', 'authorId'],
        where: {
            id: id
        }
    });

    let author = await User.findOne({
        attributes:['firstName', 'lastName', 'imagePath', "isAdmin"],
        where: {
            id: blog.authorId
        }
    });

    res.locals.blog = blog;
    res.locals.author = author;
    res.render('details');    //lấy nội dung của file details.hbs đổ vào body trong layout.hbs
}
module.exports = controller;