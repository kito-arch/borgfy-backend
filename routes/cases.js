const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require('multer')
const {v4: uuidv4} = require('uuid')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => { // setting destination of uploading files        
      cb(null, "public/uploads")
    },
    filename: (req, file, cb) => { // naming file
      cb(null, file.fieldname+"-"+uuidv4()+path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage: storage });

const uploadObj = [
    {name: 'image', maxCount: 1},
    {name: 'contribution_image', maxCount: 1},
    {name: 'brainstorm_image', maxCount: 1},
    {name: 'brainstorm_image', maxCount: 1},
    {name: 'problem_image', maxCount: 1},
    {name: 'challenge1_image', maxCount: 1},
    {name: 'challenge2_image', maxCount: 1},
    {name: 'approach_image1', maxCount: 1},
    {name: 'approach_image2', maxCount: 1},
    {name: 'approach_image3', maxCount: 1},
    {name: 'sketching_image', maxCount: 1},
    {name: 'wireframe_image', maxCount: 1},
    {name: 'approach_image1', maxCount: 1},
    {name: 'style_image1', maxCount: 1},
    {name: 'style_image2', maxCount: 1},
    {name: 'style_image3', maxCount: 1},
    {name: 'visual_image', maxCount: 1},
    {name: 'final_image', maxCount: 1},
]

const cols = "app_name, type, type2, title, description, image, person_name, person_place, contribution_text, timeline, contribution_image, brainstorm_text, brainstorm_image, objective, problem_text, problem_image, challenge1_text, challenge1_image, challenge2_text, challenge2_image, solution, approach_text, approach_image1, approach_image2, approach_image3, sketching_text, sketching_image, wireframe_text, wireframe_image, style_text, style_image1, style_image2, style_image3, visual_text, visual_image, final_image, funding, onboarding, revenue, quote, quote_by, link"
let values = (req)=>{
    let app_name = req?.body?.app_name ?? ""
    let type = req?.body?.type ?? ""
    let type2 = req?.body?.type2 ?? ""
    let title = req?.body?.title ?? ""
    let description = req?.body?.description ?? ""
    let image = req?.files?.image?.[0]?.filename ?? ""
    let person_name = req?.body?.person_name ?? ""
    let person_place = req?.body?.person_place ?? ""
    let contribution_text = req?.body?.contribution_text ?? ""
    let timeline = req?.body?.timeline ?? ""
    let contribution_image = req?.files?.contribution_image?.[0]?.filename ?? ""
    let brainstorm_text = req?.body?.brainstorm_text ?? ""
    let brainstorm_image = req?.files?.brainstorm_image?.[0]?.filename ?? ""
    let objective = req?.body?.objective ?? ""
    let problem_text = req?.body?.problem_text ?? ""
    let problem_image = req?.files?.problem_image?.[0]?.filename ?? ""
    let challenge1_text = req?.body?.challenge1_text ?? ""
    let challenge1_image = req?.files?.challenge1_image?.[0]?.filename ?? ""
    let challenge2_text = req?.body?.challenge2_text ?? ""
    let challenge2_image = req?.files?.challenge2_image?.[0]?.filename ?? ""
    let solution = req?.body?.solution ?? ""
    let approach_text = req?.body?.approach_text ?? ""
    let approach_image1 = req?.files?.approach_image1?.[0]?.filename ?? ""
    let approach_image2 = req?.files?.approach_image2?.[0]?.filename ?? ""
    let approach_image3 = req?.files?.approach_image3?.[0]?.filename ?? ""
    let sketching_text = req?.body?.sketching_text ?? ""
    let sketching_image = req?.files?.sketching_image?.[0]?.filename ?? ""
    let wireframe_text = req?.body?.wireframe_text ?? ""
    let wireframe_image = req?.files?.wireframe_image?.[0]?.filename ?? ""
    let style_text = req?.body?.style_text ?? ""
    let style_image1 = req?.files?.style_image1?.[0]?.filename ?? ""
    let style_image2 = req?.files?.style_image2?.[0]?.filename ?? ""
    let style_image3 = req?.files?.style_image3?.[0]?.filename ?? ""
    let visual_text = req?.body?.visual_text ?? ""
    let visual_image = req?.files?.visual_image?.[0]?.filename ?? ""
    let final_image = req?.files?.final_image?.[0]?.filename ?? ""
    let funding = req?.body?.funding ?? ""
    let onboarding = req?.body?.onboarding ?? ""
    let revenue = req?.body?.revenue ?? ""
    let quote = req?.body?.quote ?? ""
    let quote_by = req?.body?.quote_by ?? ""
    let link = app_name ? app_name.replace(" ", "-") + uuidv4() : "Unnamed" + uuidv4()


    return "'" + app_name + "'" + ", " + "'" + type + "'" + ", " + "'" + type2 + "'" + ", " + "'" + title + "'" + ", " + "'" + description + "'" + ", " + "'" + image + "'" + ", " + "'" + person_name + "'" + ", " + "'" + person_place + "'" + ", " + "'" + contribution_text + "'" + ", " + "'" + timeline + "'" + ", " + "'" + contribution_image + "'" + ", " + "'" + brainstorm_text + "'" + ", " + "'" + brainstorm_image + "'" + ", " + "'" + objective + "'" + ", " + "'" + problem_text + "'" + ", " + "'" + problem_image + "'" + ", " + "'" + challenge1_text + "'" + ", " + "'" + challenge1_image + "'" + ", " + "'" + challenge2_text + "'" + ", " + "'" + challenge2_image + "'" + ", " + "'" + solution + "'" + ", " + "'" + approach_text + "'" + ", " + "'" + approach_image1 + "'" + ", " + "'" + approach_image2 + "'" + ", " + "'" + approach_image3 + "'" + ", " + "'" + sketching_text + "'" + ", " + "'" + sketching_image + "'" + ", " + "'" + wireframe_text + "'" + ", " + "'" + wireframe_image + "'" + ", " + "'" + style_text + "'" + ", " + "'" + style_image1 + "'" + ", " + "'" + style_image2 + "'" + ", " + "'" + style_image3 + "'" + ", " + "'" + visual_text + "'" + ", " + "'" + visual_image + "'" + ", " + "'" + final_image + "'" + ", " + "'" + funding + "'" + ", " + "'" + onboarding + "'" + ", " + "'" + revenue + "'" + ", " + "'" + quote + "'" + ", " + "'" + quote_by + "'" + ", " + "'" + link + "'"
}

router.post("/add", upload.fields(uploadObj), (req, res)=>{
    pool.getConnection((err, connection)=>{
        if (err) {
            console.log('query connect error!', err);
            res.status(500).send("Server Internal Error");
        } 
        else{
            connection.query(`INSERT INTO cases (${cols}) VALUES (${values(req)})`, (err, rows) => {
                if (err) {
                     console.log(err);
                     res.status(500).send("Server Internal Error");
                     connection.release();
                     return;
                 }
                 else {
                     res.status(200).send("Successfully Added The Case")
                 }
             connection.release();
             });
        }
    })

})

router.get("/", (req, res)=>{
    pool.getConnection((err, connection)=>{
        if (err) {
            console.log('query connect error!', err);
            res.status(500).send("Server Internal Error");
        } 
        else{
            connection.query(`SELECT * FROM cases`, (err, rows) => {
                if (err) {
                     console.log(err);
                     res.status(500).send("Server Internal Error");
                     connection.release();
                     return;
                 }
                 else {
                     res.json(rows);
                 }
             connection.release();
             });
        }
    })
})

router.get("/:id", (req, res)=>{
    pool.getConnection((err, connection)=>{
        if (err) {
            console.log('query connect error!', err);
            res.status(500).send("Server Internal Error");
        } 
        else{
            connection.query(`SELECT * FROM cases WHERE link = '${req?.params?.id}'`, (err, rows) => {
                if (err) {
                     console.log(err);
                     res.status(500).send("Server Internal Error");
                     connection.release();
                     return;
                 }
                 else {
                     res.json(rows);
                 }
             connection.release();
             });
        }
    })
})

module.exports = router