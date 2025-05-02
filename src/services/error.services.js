const CatchErrorService=(fn)=>(req,res,next)=>{
  return Promise.resolve(fn(req,res,next)).catch(next);
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default CatchErrorService;