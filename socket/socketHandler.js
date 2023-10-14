const listener = async (socket) => {
    console.log('a user connected');

    socket.on("disconnect", () => {
        console.log("A user disconnected");
        // connection.end();
    });

}

// module.exports = { listener }