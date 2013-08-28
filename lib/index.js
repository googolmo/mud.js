
var _ = require("underscore"),
    net = require("net"),
    events = require("events"),
    default_port = 8888;

var mud = function(options) {
    this.cmds = [];
    this._pools = []; // connection pool;

    if(options !== undefined && options.encoding) {
        this.encoding = options.encoding;
    }else{
        this.encoding = 'utf8';
    }
}

mud.prototype = new events.EventEmitter;

mud.prototype.onCommand = function(cmds, func) {
    // TODO: add help text
    // TODO: imporve 
    this.cmds = _.union(this.cmds, cmds);

    _.each(cmds, function(cmd) {
        this.on("cmd_" + cmd, func);
    }, this);
}

mud.prototype.broadcast = function() {
    // write to all stream
    // TODO
}

mud.prototype.listen = function(port) {
    if(port === undefined) {
        port = default_port;
    }

    var self = this;
    
    this.client = net.createServer(function(rawClient) {
        // TODO: create Client object via c
        // c is a net.Socket object  http://nodejs.org/api/net.html#net_class_net_socket
        self._pools.push(rawClient);
        self.emit("startConnect", rawClient);

        rawClient.on('data', function(raw) {
            // when client give data
            // TODO: parse client input
            var cmd = raw.toString(), 
                cmdTrimed = cmd.trim(),
                cmdPart = cmdTrimed.split(' '), 
                action = cmdPart[0],
                args = cmdPart.slice(1);

            if(_.indexOf(self.cmds, action) === -1) {
                // non-regiested command
                self.emit("noCommand", rawClient, cmdTrimed);
                return;
            }

            self.emit("cmd_" + action, rawClient, args);
        });
    });

    this.client.listen(port, function() {
        console.log('Listening to ' + port);
    });
}

module.exports = mud;
