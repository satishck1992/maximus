$('document').ready(function() {

  var CONFIG = {
    'service': {
      'url': 'ws://54.169.217.88:5280/websocket',
      'protocol': 'wss'
    },
    'user': {
      'jid': 'b@mm.io',
      'password': 'password'
    },
    'room': {
      'node': 'princely_musings'
    }
  }

  connectToXMPP(CONFIG.service.url, CONFIG.service.protocol, CONFIG.user.jid, CONFIG.user.password);
});

/**
 * This function connects to the XMPP server.
 */
function connectToXMPP() {

}