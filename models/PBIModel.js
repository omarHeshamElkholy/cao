const mongoose = require("mongoose");  
const CryptoJS = require("crypto-js");
mongoose.connect('mongodb+srv://CAO:8eHxaEcdJv3kRNm1@cluster0.unofsw0.mongodb.net/CAO?retryWrites=true&w=majority')
  .then(() => console.log('Connected to cao PBI part!'))
  .catch((e) => console.error('connection Failed! :' + e));


const pbiSchema = new mongoose.Schema({
  PBI: String,
  BUG: String,
  errorCode: Number,
  errorDesc: String ,
  Status: String,
  Asignee: String,
  RemedyQ: String,},
  { versionKey: false }
); 

const PBI = mongoose.model('PBI', pbiSchema);



async function getAllPBI() {
    const pBI = await PBI.find()
    
    return (pBI)
}

async function getPBI(pbi) {
    let pBI = await PBI.find({PBI:pbi})

    return (pBI)
}

async function  getPBIFromErrorCode (errorCode, errorDesc){
  console.log("yes");
  let pBi = await PBI.find({errorCode:errorCode, errorDesc:errorDesc} )
  return (pBi)
}




async function createPBI(pbi) {  

    pbi = new PBI(pbi)
    
    try {
    
      const res = await pbi.save();
      return(res);

    } catch (error) {

      return("there is an issue" + error);

    }    
  }






module.exports = {getAllPBI, getPBI, createPBI,getPBIFromErrorCode}

