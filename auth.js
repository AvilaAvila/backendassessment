const express = require('express');
const router = express.Router();

const userModel = require('./models/users.model');

const config = require("./config/auth.config");
var jwt = require("jsonwebtoken");

router.post('/login',(req,res)=>{
    if(req.body.username=='' || req.body.password==''){
        return res.status(500).send({statusCode:500, hasErrors:true,result:[],message:'Missing fields!'});
    }
    userModel.findOne({username: req.body.username,password:req.body.password},(err,doc)=>{
        if(!doc)    return res.status(404).send({statusCode:404, hasErrors:true, result:[],message:'Invalid credentials!'});
        if(doc){
            const token = jwt.sign({ username: doc.username }, config.secret, {
                expiresIn: 86400
            });
            res.status(200).send({statusCode:200, hasErrors:false,result:doc,token:token,message:'User verified'});
        }
    })
})

router.post('/register',async (req,res)=>{
    if(req.body.username=='' || req.body.password==''){
        return res.status(500).send({statusCode:500, hasErrors:true,result:[],message:'Missing fields!'});
    }
    userModel.findOne({username: req.body.username},async (err,doc)=>{
        if(doc)
            return res.status(403).send({statusCode:403, hasErrors:true,result:[],message:'User already exists!'});
        
        let newUser = new userModel({
            username : req.body.username,
            password : req.body.password
        });
        let result = await newUser.save();
        if(result)
            res.status(200).send({statusCode:200, hasErrors:false,result:[],message:'User registered'});
        else
            res.status(500).send({statusCode:500, hasErrors:true,result:[],message:'Something went wrong!'});
    });
})




// router.get('/mark/:id', async (req,res)=>{
//     // let item = await itemModel.findByIdAndUpdate({_id: req.params.id},{status:"Marked"});
//     let item = await itemModel.findById({_id: req.params.id});
//     if(item){
//         item.status = "Marked";
//         item.save();
//     }
//     res.send('Item is marked!');
// })


module.exports = router;