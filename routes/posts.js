const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
    res.json({ posts: { title: "my first posts" } });
});

router.post("/upload", async (req, res) => {
    // console.log(__dirname);
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No file uploaded"
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let uploadFile = req.files.file;
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            uploadFile.mv(`./uploads/` + uploadFile.name);

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

module.exports = router;
