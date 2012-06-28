# About

This is a small experiment about implementing a "remote control" for reveal.js presentations. The "remote control" is a web page that you can load on your phone or tablet that can control what happens on the main presentation running on your laptop or desktop. 
The two pages should ideally communicate through a P2P connection. But until the WebTRC's Peer-to-peer Data API is picked up by browsers, I'm emulating P2P connections between two web pages using a simple node.js server and Socket.IO.

For more info about reveal.js see [reveal.js on github](https://github.com/hakimel/reveal.js).

This experiment is in no way ready to be used in real life situations, and is ignoring some important aspects such as security. It is an experiment ment to explore P2P communication between two web pages.

# How to run the experiment
1. Make sure you have node.js installed on your machine
2. Install the socket.io module inside the p2p_emulator folder

        cd p2p_emulator
        npm install socket.io
3. Start the P2P emulator server

        node P2PEmulator.js
Note: it starts by default on port 8080. To change the port, edit P2PEmulator.js. If you do this, you also need to modify the main presentation file (index.html) - search for 'localhost:8080' - there should be two occurrences.

4. Edit the reveal_remote.html file and replace "http://10.131.169.201:8080" with the address of the P2P emulator server (it should be the IP address of your machine and the port you configured in step 3). There are two occurrences you need to replace.

5. Publish the reveal.js folder in a local web server.
On my mac, I'm using the built in apache, so this means simply copying the reveal.js folder to ~/Sites, or just symlinking if you configure it to accept symlinks.

6. Open the reveal.js presentation in your favorite browser (that's the index.html file in the reveal.js folder your just published)

7. Load the remote control interface on your mobile device (that's the reveal_remote.html file, in the same folder where you published the reveal.js presentation). 
You can also load it on your machine, but it's less fun :)

8. At this point you should be able to control the slides from your mobile device. Try pressing the right arrow - the presentation should advance to the next slide.

Note: So far I've tested the presentation on Chrome 19, and the remote interface in Chrome 19 and on an iPad 2 with iOS 5.1.1. 

# How it works
At the core of this experiment is the direct connection between web pages (in our case the remote control page and the presentation page) - see connection.js. Because there's no direct P2P data channel available in browsers yet, this is emulated through a node.js server (folder p2p_emulator).
Connection.js abstracts a simple API for a web page to create a connection it can use to communicate with other pages in a given context - the `Connection` object. It uses socket.io to communicate to the node server which routes messages to emulate p2p connections. This means that, in modern browsers, websockets will be used under the hood.
 
The reveal.js file has been modified to accept remote commands from a remote controller web page.Two parameters have been added to the Reveal configuration object: `remoteControl` and `remoteControlConfig`. When `remoteControl` is true, it will start listening for commands received from the remote control, and handle them (see `initializeRemoteControl` and `handleRemoteCommand`).

The remote control page is implemented in `reveal_remote.html` and `reveal_remote.js`. It displays a very simple controls UI and propagates the commands through a `Connection` object to the presentation page (see reveal_remote.js). The commands arrive to the presentation page because both the presentation and the remote control used the same "pairCode" parameter when they created their connections (in real-life situations there would be some pairing mechanism involved, here I've hardcoded it for simplicity).
