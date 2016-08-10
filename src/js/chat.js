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

  var conn;

  connectXMPPServer(CONFIG.service.url, CONFIG.service.protocol, CONFIG.user.jid, CONFIG.user.password)
    .then(function(connection) {
      conn= connection;
      connectToGroup(conn, CONFIG.room.node, function() {})
        .then(function (success) {
          console.log('Connected to Group, Congratulations..')
        }, function(error) {
          console.log('Could not connect to the Group. Please try again later..');
        });
    }, function(error) {
      console.log('Could not connect to XMPP Server. Please try later..');
    });
});

/**
 * Connect To XMPP host via Strophe and promises.
 * params
 * 1. host -> XMPP service path.
 * 2. protocol -> protocol for the Service
 * 3. user_jid -> User JID for XMPP Server
 * 4. user_password -> User Password for XMPP Server
 */
function connectXMPPServer(host, protocol, user_jid, user_password) {
      return new Promise(function (fulfill, reject) {
            var conn = new Strophe.Connection(host, { protocol: protocol });
            conn.connect(user_jid, user_password, function (response) {
                  if (response === Strophe.Status.CONNECTED) {
                        fulfill(conn);
                  } else if (response === Strophe.Status.DISCONNECTED) {
                        reject();
                  }
            });
      });
}

/**
 * Connect Connection to a Room node via Strophe Pubsub Library.
 * params
 * 1. conn -> Strophe Connection
 * 2. room_node -> Room to connect to
 * 3. subscribe_event (function) -> Function to handle events inside Room.
 */
function connectToGroup(conn, room_node, subscribe_event) {
      return new Promise(function (fulfill, reject) {
            conn.pubsub.subscribe(room_node, [], subscribe_event, fulfill, reject);
      });
}