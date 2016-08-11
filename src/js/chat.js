$('document').ready(function () {

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
      .then(function (connection) {
         conn = connection;
      }, function (error) {
         console.log('Could not connect to XMPP Server. Please try later..');
      });

   $('.group_join--btn').click(function (e) {
      var groupId = $(this).closest('li.group').data('group-id');
      var groupTitle = $(this).closest('li.group').find('.detail .title').html();
      joinGroup(conn, groupId, groupTitle, 'Lallan');
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
 * This function manages Joining, handling events and deleting Group to chat.
 * params
 * 1. conn -> Strophe Connection
 * 2. room_node -> Room to connect to
 * 3. room_name -> Title of the Room
 */
function joinGroup(conn, room_node, room_name, user_name) {

   var Messenger = {
      conn: conn,
      room_node: room_node,
      room_name: room_name,
      user_name: user_name,
      domEl: {
         'closeButton': '',
         'messageList': '',
         'textInput': ''
      },
      init: function () {
         var self = this;

         this.addChatWindow();
         this.connectToGroup()
            .then(function (success) {
               self.bindEvents();
            }, function (error) {
               console.log('Sorry, could not connect to group');
            });
      },
      addChatWindow: function () {
         // if already window is present
         if ($('.chat-windows-wrapper').find('div[data-group-id="' + this.room_node + '"]').length) {
            return;
         }
         var html = '';
         html += '<div class="box chat-window" data-group-id="' + this.room_node + '">';
         html += '<div class="header"><i class="material-icons">chat</i><div class="title">' + this.room_name + '</div><a href="#" class="close-chat"><i class="material-icons">clear</i></a></div>';
         html += '<ul class="chat-messages"></ul>';
         html += '<div class="send-message"><i class="material-icons emotions-icon">insert_emoticon</i><input type="text" placeholder="Start Chatting"><i class="material-icons attach-icon">wb_cloudy</i></div>';
         html += '</div>';
         $('.chat-windows-wrapper').append(html);
         this.domEl.closeButton = $('.chat-windows-wrapper').find('div[data-group-id="' + this.room_node + '"] a.close-chat');
         this.domEl.messageList = $('.chat-windows-wrapper').find('div[data-group-id="' + this.room_node + '"] ul.chat-messages');
         this.domEl.textInput = $('.chat-windows-wrapper').find('div[data-group-id="' + this.room_node + '"] input[type="text"]');
      },
      /**
     * Connect Connection to a Room node via Strophe Pubsub Library.
     * params
     * 1. conn -> Strophe Connection
     * 2. room_node -> Room to connect to
     * 3. subscribe_event (function) -> Function to handle events inside Room.
     */
      connectToGroup: function () {
         var self = this;
         return new Promise(function (fulfill, reject) {
            self.conn.pubsub.subscribe(self.room_node, [], self.subscribe_event, fulfill, reject);
         });
      },
      subscribe_event: function (message) {
         var _data = $(message).children('event')
            .children('items')
            .children('item').text();

         var parsedDecodedData = JSON.parse(decodeURIComponent(_data));
         var user_from = parsedDecodedData.message_from;
         var html = '';
         if (user_from === Messenger.user_name) {
            html += '<li class="chat-message us">';
         } else {
            html += '<li class="chat-message them">';
         }
         html += parsedDecodedData.message_text_data;
         html += '</li>';
         $(Messenger.domEl.messageList).append(html);
         Messenger.domEl.messageList.find('li:last-child').velocity("scroll", {
            container: Messenger.domEl.messageList,
            duration: 100
         });
         return true;
      },
      bindEvents: function () {
         var self = this;
         $(this.domEl.textInput).keyup(function (e) {
            if (e.keyCode === 13) {
               self.sendMessage();
            }
         });
         $(this.domEl.closeButton).click(function (e) {
            self.removeConnection();
         });
      },
      sendMessage: function () {
         var textMessage = $(this.domEl.textInput).val();
         if (textMessage) {
            var op = {
               "message_type": "u",
               "mime_type": "t",
               "message_text_data": textMessage,
               "message_time": (new Date()).getTime(),
               "message_from": this.user_name,
               "group_server_id": this.room_node
            }
            var encodeStrifiedOp = encodeURIComponent(JSON.stringify(op));
            var m = $msg({ xmlns: 'pubsub:text:message' }).t(encodeStrifiedOp);
            this.conn.pubsub.publish(this.room_node, [{ 'attrs': '', data: encodeStrifiedOp }]);
            $(this.domEl.textInput).val('');
         }
      },
      removeConnection: function () {
         this.unbindEvents();
         this.closeConnection();
         this.removeDomElement();
      },
      unbindEvents: function () {
         $(this.domEl.textInput).unbind();
         $(this.domEl.closeButton).unbind();
      },
      closeConnection: function () {
         this.conn.pubsub.unsubscribe(this.room_node, this.user_name);
      },
      removeDomElement: function () {
         $('.chat-windows-wrapper').find('div[data-group-id="' + this.room_node + '"]').remove();
      }
   }

   Messenger.init();
}