const express = require("express");
const router = express.Router();
const caseRoutes = require("./cases");
const blogRoutes = require("./blogs");




router.get("/uploads/:name", (req, res)=>{
//     if(!req.session.admin && !req.session.logged)
//         {res.status(401).send("Log In First");
// return;}

    res.sendFile(approot + "/public/uploads/" + req.params.name)
})

router.use("/cases", caseRoutes);
router.use("/blogs", blogRoutes);


module.exports = router;