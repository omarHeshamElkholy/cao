const {cstValidate} = require("../postvalidate")
const { getAllINCs, getINCByCTN,getINCByRef, createINC, encreptINC, decreptRef } = require("../models/CstModel")
const express = require("express");
const router = express.Router();



//get 

router.get('/', async (req, res) => {

    try {
        const PBIs = await getAllINCs()
        if (PBIs) {
            res.status(200).send(PBIs);
        } else {
            res.status(204).send("DB accessed,... PBIs not found!...")
        }
        
    } catch (error) {
        res.status(501).send("there was an error when collecting data: " + error)
    }
 
});

router.get('/getINC', async (req, res)=>{

    const ctn = req.headers['ctn'];
    const ref = req.headers['ref'];

    // insted remedy intgration 
    
    const list = ["true", "false"]




    //CTN search

    if (ctn) {
        try {
            const findIssue = await getINCByCTN(ctn)
           
            const issue = JSON.parse(JSON.stringify(findIssue))
            
            if(issue[0]){
                issue[0].status = list[Math.floor(Math.random()*list.length)]
            }

            if (findIssue) {            
                res.status(200).send(issue);
            } else {
                res.status(204).send("DB accessed incident not found")
            }
     
        } catch (error) {
            res.status(501).send("there was an error when collecting data: " + error);
        }
    } 
    
    //Ref search 

    else if(ref) {
        try {
            const findIssue = await getINCByRef(ref)
            if (findIssue) {
                res.status(200).send(findIssue);
            } else {
                res.status(204).send("DB accessed incident not found")
            }
     
        } catch (error) {
            res.status(501).send("there was an error when collecting data: " + error);
        }
    }

       
});

//post

router.post("/addINC", async (req, res)=>{
    const cstINC = {
        ctn       :  req.headers['ctn'],
        errorCode :  req.headers['errorcode'],
        errorDesc :  req.headers['errordesc'],
        journey   :  req.headers['journey'],
        segment   :  req.headers['segment'],
        email     :  req.headers['email'],
    };
    
    const { error } = cstValidate(cstINC)

     if (error){
        return res.status(501).send(error.details[0].message);
    }

    //logic to create inc in remedy
    //get inc id 

    const inc = Math.floor(Math.random() * 100000000);
    console.log(inc);
    
    //encrept the inc id
    const refId = encreptINC(inc)

    console.log(refId);
    console.log(decreptRef(refId));


    cstINC.ref = refId
    

    try {      
        const addIssue = await createINC(cstINC)
        res.status(201).send("incident added correctly" + addIssue);
    } catch (error) {
        res.status(501).send("there is an issue with DB:" + error);
    }
    
});


module.exports = router;
