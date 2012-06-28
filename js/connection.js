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

/* Connection that can be used to communicate within a group of paired web pages
 * @constructor
 * @param endpoint the address of the node.js server
 * @param pairCode used as a pairing code (identifes a group of peers who can send messages to one another)
 * @param id this page's identifier within the group
 */
function Connection(endpoint, pairCode, id) {
    this.endpoint = endpoint;
    this.pairCode = pairCode;
    this.id = id;
    this.eventMessageListener = null;
}

Connection.prototype = {
    
    connect: function() {
        this.socket = io.connect(this.endpoint);
        this.socket.emit('identification', {id:this.id, pairCode:this.pairCode});
        
        this.socket.on('eventMessage', (function(data) {
            if (this.eventMessageListener) {
                this.eventMessageListener(data);
            }
        }).bind(this));
    },
    
    sendMessage: function(to, payload) {
        this.socket.emit('eventMessage', {pairCode:this.pairCode, from:this.id, to:to, payload:payload});
    }, 
    
    /* supports a single listener for now */
    addEventMessageListener: function(listener) {
        this.eventMessageListener = listener;
    }
    
};
