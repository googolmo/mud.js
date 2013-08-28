
var mud = require("mud.js");

var myWorld = mud();

myWorld.on('startConnect', function(client) {
    client.write("Welcome to Mud.js Hello World!");
    client.read("Username: ", function checkUsername(username) {
        if(!username || username.length <= 3 || username.length >= 16) {
            return client.read("Username: ", checkUsername);
        }
        client.read("Password: ", function checkPassword(password) {
            if(!password || password.length <= 3 || password.length >= 16) {
                return client.read("Password: ", checkPassword);
            }
            if(password != "test") {
                client.close("Wrong password!");
            }
            client.set({'username' : 'fanzeyi', 'logined' : 1});
            myWorld.emit("initEnv");
        });
    });
});

myWorld.on('initEnv', function(client) {
    var room = getRoom(client.get('room_id'));
    room.writeStream(client);
});

myWorld.onCommand(['look', 'l'], function(client) {
    var room = getRoom(client.get('room_id'));
    room.writeStream(client);
});

myWorld.onCommand(['exit', 'quit'], function(client) {
    savePlayer(client);
    client.close('Bye bye!');
});

setInterval(function() {
    var current = new Date();    
    myWorld.broadcast('Current Time:' + current.toTimeString());
}, 30000);

myWorld.listen(8888);
