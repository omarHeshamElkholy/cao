const mongoose = require("mongoose");  
const CryptoJS = require("crypto-js");
mongoose.connect('mongodb+srv://CAO:8eHxaEcdJv3kRNm1@cluster0.unofsw0.mongodb.net/CAO?retryWrites=true&w=majority')
  .then(() => console.log('Connected to cao incs part!'))
  .catch((e) => console.error('connection Failed! :' + e));


const cstSchema = new mongoose.Schema({
  ctn: Number,
  errorCode:  Number,
  errorDesc: String ,
  journey: String ,
  issue_recent_time: {type: Date, default: Date.now},
  segment: String ,
  email: String,
  ref: String },
  { versionKey: false }
); 

const CST = mongoose.model('cst_inc', cstSchema);



async function getAllINCs() {
    const pBI = await CST.find()
    
    return (pBI)
}

async function getINCByCTN(ctn) {
    let pBI = await CST.find({ctn:ctn})

    return (pBI)
}

async function getINCByRef(ref) {
  let pBI = await CST.find({ref:ref})

  return (pBI)
}


async function createINC(cst) {  

    cst = new CST(cst)
    
    try {
    
      const res = await cst.save();
      return(res);

    } catch (error) {

      return("there is an issue" + error);

    }    
  }

  function encreptINC (iNC){
    let cryptbase = 78901234;
    return iNC ^ cryptbase;
  }

  function decreptRef(refID) {
    let cryptbase = 78901234;
    return refID ^ cryptbase;
  }





module.exports = {getAllINCs, getINCByCTN,getINCByRef, createINC, encreptINC, decreptRef}

