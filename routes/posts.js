const router = require("express").Router();
const verify = require("./verifyToken");
const Menu = require("../model/Menu");
const Category = require("../model/Category");
const { categoryValidation, menuValidation } = require("../validation");
const fs = require("fs");

// get all menu
router.get("/menu", async (req, res) => {
    try {
        const getMenu = await Menu.find();
        res.send(getMenu);
    } catch (err) {
        res.status(400).send(err);
    }
});

// get all category
router.get("/category", async (req, res) => {
    try {
        const getCategory = await Category.find().sort({ date: 1 });
        res.send(getCategory);
    } catch (err) {
        res.status(400).send(err);
    }
});

// add menu
router.post("/add/menu", verify, async (req, res) => {
    // validate menu
    const { error } = menuValidation(req.body);
    if (error)
        return res
            .status(400)
            .send({ [error.details[0].context.key]: error.details[0].message });

    // Check is the menu is already exist
    const menuExist = await Menu.findOne({ title: req.body.title });
    if (menuExist)
        return res.status(400).send({ message: `Menu already exist` });

    // Check is category exist
    const haveCategory = await Category.findOne({ name: req.body.category });
    if (!haveCategory)
        return res.status(400).send({ message: `Category not found` });

    const menu = new Menu({
        title: req.body.title,
        cost: req.body.cost,
        category: req.body.category
    });
    try {
        const savedMenu = await menu.save();
        res.status(200).send(savedMenu);
    } catch (err) {
        res.status(400).send(err);
    }
});

// add category
router.post("/add/category", verify, async (req, res) => {
    // validate category
    const { error } = categoryValidation(req.body);
    if (error)
        return res
            .status(400)
            .send({ [error.details[0].context.key]: error.details[0].message });

    // check is category already exist
    const categoryExist = await Category.findOne({ name: req.body.name });
    if (categoryExist)
        return res.status(400).send({ message: `Category already exist` });

    // limit category count
    const categoryCount = await Category.estimatedDocumentCount();
    if (categoryCount >= 4)
        return res
            .status(400)
            .send({ message: `Category reached the maximum number` });

    const category = new Category({
        id: req.body.id,
        name: req.body.name
    });
    try {
        const savedCategory = await category.save();
        res.status(200).send(savedCategory);
    } catch (err) {
        res.status(400).send(err);
    }
});

// add image
router.post("/upload", verify, async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No file uploaded"
            });
        } else {
            //Use the name of the input field to retrieve the uploaded file
            let uploadFile = req.files.file;
            //Use the mv() method to place the file in upload directory
            uploadFile.mv(`./uploads/${uploadFile.name}.jpg`);

            //send response
            res.send({
                status: true,
                message: "File is uploaded",
                data: {
                    name: uploadFile.name,
                    mimetype: uploadFile.mimetype,
                    size: uploadFile.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// delete menu
router.delete("/delete/menu", verify, async (req, res) => {
    const menuId = req.body._id;
    // check is menu already exist
    const isExist = await Menu.findOne({ _id: menuId });
    if (!isExist)
        return res.status(400).send({ message: `Menu ${menuId} not found` });

    try {
        const deleteMenu = await Menu.deleteOne({ _id: menuId });
        res.status(200).send({ message: `menu ${menuId} delete successfully` });
    } catch (err) {
        res.status(400).send(err);
    }
});

//delete category
router.delete("/delete/category", verify, async (req, res) => {
    const categoryId = req.body._id;
    // check is menu already exist
    const isExist = await Category.findOne({ _id: categoryId });
    if (!isExist)
        return res
            .status(400)
            .send({ message: `Menu ${categoryId} not found` });

    try {
        const deleteCategory = await Menu.deleteOne({ _id: categoryId });
        res.status(200).send({
            message: `menu ${categoryId} delete successfully`
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

//delete img
router.delete("/delete/img", verify, async (req, res) => {
    const menuId = req.body._id;
    try {
        fs.unlinkSync(`./uploads/${menuId}.jpg`);
        res.status(200).send({
            message: `Image ${menuId}.jpg delete successfully`
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

//update menu
router.patch("/update/menu", verify, async (req, res) => {
    const menuId = req.body._id;
    try {
        const updateMenu = await Menu.update(
            { _id: menuId },
            {
                $set: {
                    title: req.body.title,
                    cost: req.body.cost,
                    category: req.body.category
                }
            }
        );
        res.status(200).send({ message: `menu ${menuId} update successfully` });
    } catch (err) {
        res.status(400).send(err);
    }
});
module.exports = router;
