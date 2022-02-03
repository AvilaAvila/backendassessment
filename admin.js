const express = require('express');
const router = express.Router();

const userModel = require('./models/users.model');

router.get('/get-all-users',(req,res)=>{
    userModel.find((err,doc)=>{
        if(!doc)    
            return res.status(404).send({statusCode:404, hasErrors:true,result:[],message:'No users found!'});
        if(doc)
            return res.status(200).send({statusCode:200, hasErrors:false,result:doc,message:'Users List!'});
    });
});

router.get('/search-user/:username',(req,res)=>{
    if(req.params.username==''){
        return res.status(500).send({statusCode:500, hasErrors:true,result:[],message:'Missing fields!'});
    }
    userModel.findOne({username:req.params.username},(err,doc)=>{
        if(!doc)    
            return res.status(404).send({statusCode:404, hasErrors:true,result:[],message:'Username not found!'});
        else
            return res.status(200).send({statusCode:200, hasErrors:false,result:doc,message:'User details!'});
    });
});

router.post('/update-user/:id',async (req,res)=>{
    if(req.params.id==''){
        return res.status(500).send({statusCode:500, hasErrors:true,result:[],message:'Missing fields!'});
    }
    let user = await userModel.findById({_id: req.params.id});
    if(user){
        user.name=req.body.name;
        user.email=req.body.email;
        user.gender=req.body.gender;
        user.about=req.body.about;
        user.strength=req.body.strength;
        user.save();
        return res.status(200).send({statusCode:200, hasErrors:false,result:user,message:'User details updated!'});
    }
    else
        res.status(500).send({statusCode:500, hasErrors:true,result:[],message:'Something went wrong!'});
});

router.post('/delete-user/:id',async (req,res)=>{
    if(req.params.id==''){
        return res.status(500).send({statusCode:500, hasErrors:true,result:[],message:'Missing fields!'});
    }
    userModel.findOne({_id: req.params.id},async (err,doc)=>{
        if(!doc)
            return res.status(404).send({statusCode:404, hasErrors:true,result:[],message:'User not found!'});
        
        let user = await userModel.deleteOne({_id: req.params.id});
        if(user)
            return res.status(200).send({statusCode:200, hasErrors:false,result:[],message:'User deleted!'});
        else
            return res.status(500).send({statusCode:500, hasErrors:true,result:[],message:'Something went wrong!'});
    });
});

router.post('/create-user',(req,res)=>{
    if(req.body.username=='' || req.body.password==''){
        return res.status(500).send({statusCode:500, hasErrors:true,result:[],message:'Missing fields!'});
    }
    userModel.findOne({username: req.body.username},async (err,doc)=>{
        if(doc)
            return res.status(403).send({statusCode:403, hasErrors:true,result:[],message:'User already exists!'});
        
        let newUser = new userModel({
            username : req.body.username,
            password : req.body.password,
            name : req.body.name,
            email : req.body.email,
            gender : req.body.gender,
            about : req.body.about,
            strength : req.body.strength,
        });
        let result = await newUser.save();
        if(result)
            res.status(200).send({statusCode:200, hasErrors:false,result:result,message:'User created'});
        else
            res.status(500).send({statusCode:500, hasErrors:true,result:[],message:'Something went wrong!'});
    });
});

module.exports = router;