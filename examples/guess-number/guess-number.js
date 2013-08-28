
var mud = require("mud.js");

var world = new mud();

world.onCommand(['exit', 'quit', 'e', 'q'], function(client, args) {
    client.write('Your number is ' + client.number + '\n');
    client.end('Bye bye!\n');
});

world.onCommand(['guess', 'g'], function(client, args) {
    var userGuessNum = parseInt(args[0]);
    
    if(userGuessNum < client.number) {
        client.write("Samller than the number!\n");
    }else if(userGuessNum > client.number) {
        client.write("Bigger than the number!\n");
    }else if(userGuessNum === client.number){
        client.write("Right!\n");
        client.end('Bye bye!\n');
    }else{
        client.write("Please guess a number!\n");
    }
});

world.on('noCommand', function(client, fullCmd) {
    client.write('Wrong command, use `guess` to guess number\n');
});

world.on('startConnect', function(client) {
    console.log("got a client.");
    client.write("Welcome to mud.js Hello-World\n");
    client.write("Now, I have a number (0-9). Try to guess it.\n");
    client.number = parseInt(Math.random() * 100 % 10);
});

world.listen();
