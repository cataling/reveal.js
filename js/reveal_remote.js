var RevealRemote = (function(){
    var connection = null,    
    
    //the id used by the presentation to connect to the p2p perver
    presoConnectionId = null,
        
    //caches DOM elements
    dom = {};
    
    function initialize(config) {
        connection = new Connection(config.p2pserver, config.pairCode, config.id);

        presoConnectionId = config.presoConnectionId;
    
        connection.connect();
        
        initializeDOM(); 
        hookDomEvents();
        
    }

    function initializeDOM() { 
        dom.leftArrow = document.getElementById('leftArrow');
        dom.rightArrow = document.getElementById('rightArrow');
        dom.upArrow = document.getElementById('upArrow');
        dom.downArrow = document.getElementById('downArrow');
    }
        
    function hookDomEvents() {
        dom.leftArrow.addEventListener('click', leftControlClick);
        dom.rightArrow.addEventListener('click', rightControlClick);
        dom.upArrow.addEventListener('click', upControlClick);
        dom.downArrow.addEventListener('click', downControlClick);
    }
    
    function leftControlClick(event) {
        event.preventDefault();
        sendNavigateEvent('left');
    }

    function rightControlClick(event) {
        event.preventDefault();
        sendNavigateEvent('right');
    }

    function upControlClick(event) {
        event.preventDefault();
        sendNavigateEvent('up');
    }

    function downControlClick(event) {
        event.preventDefault();
        sendNavigateEvent('down');
    }

    function sendNavigateEvent(direction) {
        connection.sendMessage(presoConnectionId, {type: 'nav', direction: direction});
    }
    
    // public interface
    return {
        initialize:initialize
    }
})();

