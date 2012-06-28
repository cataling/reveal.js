/*
Copyright (C) 2012 Adobe Systems, Incorporated. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var socketIO = require("socket.io");

var io = socketIO.listen(8080);

var pairs = {};
    
io.sockets.on('connection', function(socket) {
    console.log("Socket.io connection created");
    
    socket.on('identification', function(data) {
        var pairCode = data.pairCode; 
        var id = data.id; 
        
        console.log("Registered party for pairing code " + pairCode + " with id " + id);
        
        if (typeof(pairs[pairCode]) === "undefined") {
            pairs[pairCode] = {};
        }
        
        pairs[pairCode][id] = {socket:socket};        
    });
    
    socket.on('eventMessage', function(data) {
        var pairCode = data.pairCode;
        var to = data.to; 
        var recipient = pairs[pairCode][to];
        if (recipient) {
            recipient.socket.emit('eventMessage', data)
        }
    });
    
    //todo handle disconnects to clean up resources
});

