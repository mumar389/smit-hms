
module.exports.handleSocket=(socketServer)=>{
    const io=require('socket.io')(socketServer,{cors:{origin:'*'}});
    io.on('connection',(socket)=>{
        // console.log("connection established---",socket.id);
        socket.on('send-notify',(data)=>{
            // console.log("Notification Received in backend",data);
      socket.broadcast.emit('recv-notify',data);
        })
    })

}