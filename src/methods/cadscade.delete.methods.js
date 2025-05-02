import CatchErrorService from "../services/error.services.js"

const cascadeDeleteMethod=({model,field,value})=>{
  return CatchErrorService(async(req,res)=>{
    const deleteCascade=await model.deleteMany({
      [field]:req.params[value]
    });
    if (!deleteCascade) return false;
    return true;
  })
}

export default cascadeDeleteMethod;