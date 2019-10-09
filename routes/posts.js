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

//get category by id
router.get("/category/:uid", async (req, res) => {
    try {
        const getCategory = await Category.find({ _id: req.params.uid });
        res.status(200).send(getCategory);
    } catch (err) {
        res.status(400).send(err);
    }
});

// add menu
router.post("/menu", verify, async (req, res) => {
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
    const haveCategory = await Category.findOne({ _id: req.body.category });
    if (!haveCategory)
        return res.status(400).send({ message: `Category not found` });

    const menu = new Menu({
        title: req.body.title,
        cost: req.body.cost,
        category: haveCategory._id
    });
    try {
        const savedMenu = await menu.save();
        res.status(200).send(savedMenu);
    } catch (err) {
        res.status(400).send(err);
    }
});

// add category
router.post("/category", verify, async (req, res) => {
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
router.post("/img", verify, async (req, res) => {
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
router.delete("/menu", verify, async (req, res) => {
    const menuId = req.body._id;

    try {
        // check is menu already exist
        const isExist = await Menu.findOne({ _id: menuId });
        if (!isExist)
            return res
                .status(400)
                .send({ message: `Menu ${menuId} not found` });

        // delete Menu
        const deleteMenu = await Menu.deleteOne({ _id: menuId });
        if (fs.existsSync(`./uploads/${menuId}.jpg`)) {
            fs.unlinkSync(`./uploads/${menuId}.jpg`);
        }
        res.status(200).send({ message: `menu ${menuId} delete successfully` });
    } catch (err) {
        res.status(400).send(err);
    }
});

//delete category
router.delete("/category", verify, async (req, res) => {
    const categoryId = req.body._id;
    try {
        // check is category already exist
        const isExist = await Category.findOne({ _id: categoryId });
        if (!isExist)
            return res
                .status(400)
                .send({ message: `Category ${categoryId} not found` });

        // check have any menu
        const haveMenu = await Menu.findOne({ category: categoryId });
        if (haveMenu)
            return res
                .status(400)
                .send({ message: `There have some menu in category` });

        // delete category
        const deleteCategory = await Category.deleteOne({ _id: categoryId });
        res.status(200).send({
            message: `menu ${categoryId} delete successfully`
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

//delete img
router.delete("/img", verify, async (req, res) => {
    const menuId = req.body._id;

    try {
        //is img exist
        if (!fs.existsSync(menuId))
            return res.send({ message: `img not found` });

        fs.unlinkSync(`./uploads/${menuId}.jpg`);
        res.status(200).send({
            message: `Image ${menuId}.jpg delete successfully`
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

//update menu
router.patch("/menu", verify, async (req, res) => {
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

//update category
router.patch("/category", verify, async (req, res) => {
    const categoryId = req.body._id;
    try {
        const updateCategory = await Category.update(
            { _id: categoryId },
            { $set: { name: req.body.name } }
        );
        res.status(200).send({
            message: `Category ${categoryId} update successfully`
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
