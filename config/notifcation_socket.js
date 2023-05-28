
module.exports.handleSocket=(socketServer)=>{
    const io=require('socket.io')(socketServer,{cors:{origin:'*'}});
    io.on('connection',(socket)=>{
        console.log("connection established---",socket.id);
    })

}