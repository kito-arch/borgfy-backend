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
    {name: 'image1', maxCount: 1},
    {name: 'image2', maxCount: 1},
    {name: 'image3', maxCount: 20},
]

const cols = "title, subtext, image1, image2, facebook_link, twitter_link, linkedin_link, instagram_link, date, link"
let values = (req)=>{
    let title = req?.body?.title ?? ""
    let subtext = req?.body?.subtext ?? ""
    let image1 = req?.files?.image1?.[0]?.filename ?? ""
    let image2 = req?.files?.image2?.[0]?.filename ?? ""
    let facebook_link = req?.body?.facebook_link ?? ""
    let twitter_link = req?.body?.twitter_link ?? ""
    let linkedin_link = req?.body?.linkedin_link ?? ""
    let instagram_link = req?.body?.instagram_link ?? ""
    let date = req?.body?.date ?? ""
    let link = title ? title.replace(" ", "-") + uuidv4() : "Unnamed" + uuidv4()

    return "'" + title + "', '" + subtext + "', '" + image1 + "', '" + image2 + "', '" + facebook_link + "', '" + twitter_link + "', '" + linkedin_link + "', '" + instagram_link + "', '" + date + "', '" + link + "'"
}

let blog = (req, section, index)=>{
    let title = section.title ?? ""
    let description = section.description ?? ""
    let image = req?.files?.image3?.[index]?.filename ?? ""
    return "'" + title + "', '" + description + "', '" + image + "'"
}

router.post("/add", upload.fields(uploadObj), (req, res)=>{
    pool.getConnection((err, connection)=>{

        (()=>{
            return new Promise((resolve, reject)=>{
                if (err) {
                    reject(err)
                } 
                else{
                    connection.query(`INSERT INTO blogs (${cols}) VALUES (${values(req)})`, (err, rows) => {
                        if (err) {
                            reject(err)
                        }
                        else {
                            let blog_id = parseInt(rows.insertId);
                            let query = "";
                            JSON.parse(req.body.sections).forEach((section, index)=>{
                                query += `INSERT INTO blog_sections (title, description, image, blog_id) VALUES (${blog(req, section, index)}, ${blog_id});`
                            })
                            connection.query(query, (e, r)=>{
                                if (err) {
                                    reject(e)
                                }
                                else{
                                    resolve(r)
                                }
                            })
                        }
                     });
                }
            })
        })()
        .then((r)=>{
            res.status(200).send("Blog Added Successfully")
            connection.release();
        })
        .catch((e)=>{
            console.log(e)
            res.status(500).send("Server Internal Error");
            connection.release();
        })

        
    })

})

router.get("/", (req, res)=>{
    pool.getConnection((err, connection)=>{
        if (err) {
            console.log('query connect error!', err);
            res.status(500).send("Server Internal Error");
        } 
        else{
            connection.query(`SELECT *, blogs.title as blog_title, blogs.id as id, blog_sections.id as section_id, blog_sections.title as section_title FROM blogs LEFT OUTER JOIN blog_sections ON blog_sections.blog_id = blogs.id`, (err, rows) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Server Internal Error");
                    connection.release();
                    return;
                 }
                 else {
                    let blogs = []
                    rows.forEach((row)=>{
                        if(blogs.find(b => b.id == row.id))
                            return

                        let sections = []
                        rows.filter(r => r.id == row.id).forEach((o)=>{sections.push({title: o.section_title, description: o.description, image: o.image})})
                        blogs.push({id: row.id, title: row.blog_title, subtext: row.subtext, image1: row.image1, image2: row.image2, facebook_link: row.facebook_link, twitter_link: row.twitter_link, linkedin_link: row.linkedin_link, instagram_link: row.instagram_link, date: row.date, link: row.link, sections: sections})

                        
                    })
                    res.json(blogs)
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
            connection.query(`SELECT *, blogs.title as blog_title, blogs.id as id, blog_sections.id as section_id, blog_sections.title as section_title FROM blogs LEFT OUTER JOIN blog_sections ON blog_sections.blog_id = blogs.id WHERE link = '${req.params.id}'`, (err, rows) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Server Internal Error");
                    connection.release();
                    return;
                 }
                 else {
                    let blogs = []
                    rows.forEach((row)=>{
                        if(blogs.find(b => b.id == row.id))
                            return

                        let sections = []
                        rows.filter(r => r.id == row.id).forEach((o)=>{sections.push({title: o.section_title, description: o.description, image: o.image})})
                        blogs.push({id: row.id, title: row.blog_title, subtext: row.subtext, image1: row.image1, image2: row.image2, facebook_link: row.facebook_link, twitter_link: row.twitter_link, linkedin_link: row.linkedin_link, instagram_link: row.instagram_link, date: row.date, link: row.link, sections: sections})

                        
                    })
                    res.json(blogs)
                 }
             connection.release();
             });
        }
    })
})


router.post("/delete/:id", (req, res)=>{
    pool.getConnection((err, connection)=>{
        if (err) {
            console.log('query connect error!', err);
            res.status(500).send("Server Internal Error");
        } 
        else{
            connection.query(`DELETE FROM blog_sections WHERE blog_id = ANY (SELECT id FROM blogs WHERE link = '${req.params.id}');`, (err, rows) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Server Internal Error");
                    connection.release();
                    return;
                 }
                 else {
                    connection.query(`DELETE FROM blogs WHERE link = '${req.params.id}'`, (e, r)=>{
                        if (e) {
                            console.log(e);
                            res.status(500).send("Server Internal Error");
                            return;
                        }
                        else{
                            res.send("Deleted Successfully")
                        }
                    })
                 }
             connection.release();
             });
        }
    })
})

module.exports = router