const routeNotFoundMiddleware = (req, res, next)=>{
    res.status(404).send("<h1>Route Does Not Exist</h1>")
}

module.exports = routeNotFoundMiddleware