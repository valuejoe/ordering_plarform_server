const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

// register account
router.post("/register", async (req, res) => {
    //VALIDATE req DATA
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if the user is already created
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send(`Email already exist`);

    //Hash passwords
    const salt = await bycrypt.genSalt(10);
    const hashPassword = await bycrypt.hash(req.body.password, salt);
    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ message: `user ${user._id} create successfully` });
    } catch (err) {
        res.status(400).send(err);
    }
});

// login
router.post("/login", async (req, res) => {
    //VALIDATE req DATA
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Is Email exit
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email is not found");

    //Is password correct
    const validPassword = await bycrypt.compare(
        req.body.password,
        user.password
    );
    if (!validPassword) return res.status(400).send("Invalid Password");

    //Create and assign token
    const token = jwt.sign(
        { _id: user._id, name: user.name },
        process.env.TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    res.header("Authorization", `Bearer ${token}`).send(`Bearer ${token}`);
});

// delete account
router.delete("/delete", verify, async (req, res) => {
    const userId = req.user._id;
    try {
        const removeUser = await User.deleteOne({ _id: userId });
        res.json(removeUser);
    } catch (err) {
        res.status(400).json(err);
    }
});

// update testing
// router.patch("/update", async (req, res) => {
//     try {
//         const userUpdate = await User.update(
//             { _id: req.body._id },
//             { $set: { profile: req.body.profile } },
//             { multi: true }
//         );
//         res.json(userUpdate);
//     } catch (err) {
//         res.status(400).json(err);
//     }
// });

module.exports = router;
