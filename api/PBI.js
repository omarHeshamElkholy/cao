const {pbiValidate} = require("../postvalidate")
const {getAllPBI, getPBI, createPBI, getPBIFromErrorCode } = require("../models/PBIModel")
const express = require("express");
const router = express.Router();



//get 

router.get('/', async (req, res) => {
    try {
        const PBIs = await getAllPBI()
        if (PBIs) {
            res.status(200).send(PBIs);
        } else {
            res.status(204).send("DB accessed,... PBIs not found!...")
        }
        
    } catch (error) {
        res.status(501).send("there was an error when collecting data: " + error)
    }
 
});

router.get('/getPBI', async (req, res)=>{

    if (req.headers['pbi']) {
        const pbi = req.headers['pbi']
            try {
                const findIssue = await getPBI(pbi)
                if (findIssue) {            
                    res.status(200).send(findIssue);
                } else {
                    res.status(204).send("DB accessed PBI not found")
                }
         
            } catch (error) {
                res.status(501).send("there was an error when collecting data: " + error);
            }
            
    } else if (req.headers['errorcode'] && req.headers['errordesc']) {

        const errorCode = req.headers['errorcode'];
        const errorDesc = req.headers['errordesc'];

        try { 
            const findIssue = await getPBIFromErrorCode(errorCode, errorDesc )
            if (findIssue) {            
                res.status(200).send(findIssue);
            } else {
                res.status(204).send("DB accessed PBI not found")
            }
            
        } catch (error) {
            res.status(501).send("there was an error when collecting data: " + error);
            
        }

        
    }
   
           
});

//post

router.post("/addPBI", async (req, res)=>{

    const pbi = {
        PBI       :  req.headers['pbi'],
        BUG       :  req.headers['bug'],
        errorDesc :  req.headers['errordesc'],
        errorCode :  req.headers['errorcode'],
        Status    :  req.headers['status'],
        Asignee   :  req.headers['asignee'],
        RemedyQ   :  req.headers['remedyq'],
    };
    
    const { error } = pbiValidate(pbi)

     if (error){
        return res.status(501).send(error.details[0].message);
    }    

    try {      
        const addIssue = await createPBI(pbi)
        res.status(201).send("pbi added correctly" + addIssue);
    } catch (error) {
        res.status(501).send("there is an issue with DB:" + error);
    }
    
});


module.exports = router;
