import proxy from "express-http-proxy"

const proxyWithHeader=(serviceUrl)=>{

    return proxy(serviceUrl,{
        proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
            proxyReqOpts.headers["x-user-id"]=srcReq.user.userID
        }
    })
}