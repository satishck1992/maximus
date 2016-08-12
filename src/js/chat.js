$('document').ready(function () {

   var CONFIG = {
      'service': { 'url': 'ws://54.169.217.88:5280/websocket', 'protocol': 'wss' },
      'user': { 'jid': 'b@mm.io', 'password': 'password' },
      'room': { 'node': 'princely_musings' }
   }

   var CHAT_CONTROL = {
      conn: '',
      rooms_list: [],
      init: function () {
         var self = this;
         isUserAuthorized()
            .then(function (success) {
               return connectXMPPServer(CONFIG.service.url, CONFIG.service.protocol, CONFIG.user.jid, CONFIG.user.password);
            })
            .then(function (connection) {
               self.conn = connection;
               return getRoomsList();
            })
            .then(function (rooms_list) {
               self.rooms_list = rooms_list;
               self.buildGroupsHtml();
               self.bindRoomEvents();
            })
            .catch(function (error) {
               self.showErrorMsg(error);
            });
      },
      buildGroupsHtml: function () {
         var html = '';
         $.each(this.rooms_list, function (i, room) {
            html += '<li class="group" data-group-id="' + room.id + '">';
            html += '<div class="avatar"><img src="' + room.image + '" class="circle" /></div>'
            html += '<div class="detail">';
            html += '<div class="title">' + room.name + '</div>';
            html += '<div class="meta"><span class="room-number"><i class="material-icons">pets</i> : ' + room.srno + '</span><span class="users-count"><i class="material-icons">face</i> ' + room.user_count + '</span></div>';
            html += '</div>';
            html += '<div class="action"><a href="#" class="group_peek--btn"><i class="material-icons">hearing</i></a><a href="#" class="group_join--btn"><i class="material-icons">chat</i></a></div>';
            html += '</li>';
         });
         $('ul.groups-list').html(html);
      },
      bindRoomEvents: function () {
         var self = this;
         var h = new holmes({
            input: '.groups-list-box input',
            find: 'ul.groups-list li',
            placeholder: 'No result found..',
            instant: true,
            class: {
               hidden: 'hide'
            }
         });
         $('ul.groups-list .group_peek--btn').click(function (e) {
            e.preventDefault();
            var room_node = getRoomNode(this);
            var room_title = getRoomTitle(this);
            // self.openPeekWindow(self.conn, room_node, room_title);
         });
         $('ul.groups-list .group_join--btn:not("opened")').click(function (e) {
            e.preventDefault();
            var self2 = this;
            if ($(this).hasClass('opened')) {
               return;
            }
            var room_node = getRoomNode(this);
            var room_title = getRoomTitle(this);
            $(this).addClass('opened');
            openChatWindow(self.conn, room_node, room_title, CONFIG.user.jid, onCloseEvent, successEvent);
            function onCloseEvent() {
               $(self2).removeClass('opened');
               $(self2).closest('li.group').removeClass('active');
            }

            function successEvent() {
               $(self2).closest('li.group').addClass('active');
            }
         });
         function getRoomNode(el) {
            return $(el).closest('li.group').data('group-id');
         }
         function getRoomTitle(el) {
            return $(el).closest('li.group').find('.detail .title').html()
         }
      },
      showErrorMsg: function (err0r_msg) {
         var html = '<li class="error">' + err0r_msg + '</li>';
         $('ul.groups-list').html(html);
      }
   }
   CHAT_CONTROL.init();
});

/**
 * Check if the user is authorized to view the page.
 * @return {boolean} isAuthorized or not.
 */
function isUserAuthorized() {
   // can check for some value in cookies or through server API call
   return new Promise(function (fulfill, reject) {
      fulfill(true);
   });
}


/**
 * Connect XMPP host via Strophe and promises.
 * params
 * 1. host -> XMPP service path.
 * 2. protocol -> protocol for the Service
 * 3. user_jid -> User JID for XMPP Server
 * 4. user_password -> User Password for XMPP Server
 * @fulfills conn {object} Established XMPP Connection 
 */
function connectXMPPServer(host, protocol, user_jid, user_password) {
   return new Promise(function (fulfill, reject) {
      var conn = new Strophe.Connection(host, { protocol: protocol });
      conn.connect(user_jid, user_password, function (response) {
         if (response === Strophe.Status.CONNECTED) {
            fulfill(conn);
         } else if (response === Strophe.Status.DISCONNECTED) {
            reject('Cannot connect to XMPP server.');
         } else if (response === Strophe.Status.AUTHFAIL) {
            reject('XMPP User Authentication Failed.')
         }
      });
   });
}

/**
 * Gets array of Rooms.
 * @return {array} List of Rooms.
 */
function getRoomsList() {
   // ajax call to get rooms list.
   return new Promise(function (fulfill, reject) {
      fulfill([
         {
            srno: 1,
            id: 'princely_musings',
            name: 'The Troubled vs The Consistently Consistent: Pakistan vs England',
            image: 'https://www.sportsunity.co/blog/wp-content/uploads/2016/07/england-vs-pakistan-schedule-2016-ireland-vs-pakistan-schedule-2016-770x462.jpg',
            user_count: 7,
         },
         {
            srno: 1,
            id: 'test_ultra_group_2',
            name: 'Road to the final showdown: France',
            image: 'https://www.sportsunity.co/blog/wp-content/uploads/2016/06/france.jpg',
            user_count: 5
         },
         {
            srno: 1,
            id: 'princely_musings_3',
            name: 'Euros 2016 Germany vs France : World Champions face the hosts',
            image: 'https://www.sportsunity.co/blog/wp-content/uploads/2016/07/germany-vs-france.jpg',
            user_count: 4
         },
      ]);
   });
}


/**
 * 
 */
function openChatWindow(conn, room_node, room_title, user_jid, closeEvent, successCb) {

   var CHAT_BOX = {
      conn: conn,
      room_node: room_node,
      room_title: room_title,
      user_jid: user_jid,
      user_name: '',
      domEl: { 'mainDiv': '', 'closeButton': '', 'messageList': '', 'textInput': '' },
      init: function () {
         var self = this;
         this.user_name = 'lalu';
         this.showChatWindow();
         this.bindChatEvents();
         this.connectToGroup()
            .then(function (success) {
               self.domEl.messageList.find('li.connecting').remove();
            }, function (error) {
               self.domEl.messageList.find('li.connecting').addClass('error').html('Could not connect to the Group.');
            });
         successCb();
      },
      showChatWindow: function () {
         var html = '';
         html += '<div class="box chat-window" data-group-id="' + this.room_node + '">';
         html += '<div class="header"><i class="material-icons">chat</i><div class="title">' + this.room_title + '</div><a href="#" class="close-chat"><i class="material-icons">clear</i></a></div>';
         html += '<ul class="chat-messages"><li class="connecting">Connecting to group.. Please wait..</li></ul>';
         html += '<div class="send-message"><i class="material-icons emotions-icon">insert_emoticon</i><input type="text" placeholder="Start Chatting"><i class="material-icons attach-icon">wb_cloudy</i></div>';
         html += '</div>';
         $('.chat-windows-wrapper').append(html);
         this.domEl.mainDiv = $('.chat-windows-wrapper').find('div[data-group-id="' + this.room_node + '"]');
         this.domEl.closeButton = $('.chat-windows-wrapper').find('div[data-group-id="' + this.room_node + '"] a.close-chat');
         this.domEl.messageList = $('.chat-windows-wrapper').find('div[data-group-id="' + this.room_node + '"] ul.chat-messages');
         this.domEl.textInput = $('.chat-windows-wrapper').find('div[data-group-id="' + this.room_node + '"] input[type="text"]');
      },
      connectToGroup: function () {
         var self = this;
         return new Promise(function (fulfill, reject) {
            self.conn.pubsub.subscribe(self.room_node, [], self.onMessageEvent, fulfill, reject);
         });
      },
      onMessageEvent: function (message) {
         console.log(message);
         // library error work-a-round, else message repeats in multiple group.
         var _event__node = $(message).children('event').children('items').attr('node');
         if (_event__node !== CHAT_BOX.room_node) {
            return true;
         }

         var _data = $(message).children('event')
            .children('items')
            .children('item').text();

         var parsedDecodedData = JSON.parse(decodeURIComponent(_data));
         CHAT_BOX.addMessage(parsedDecodedData);
         return true;
      },
      addMessage: function (message_obj) {
         var user_from = message_obj.message_from;
         var html = '';
         if (user_from === this.user_name) {
            html += '<li class="chat-message us">';
         } else {
            html += '<li class="chat-message them">';
         }
         html += message_obj.message_text_data;
         html += '</li>';
         $(this.domEl.messageList).append(html);
         this.domEl.messageList.find('li:last-child').velocity("scroll", {
            container: this.domEl.messageList,
            duration: 100
         });
         if (user_from !== this.user_name) {
            this.highlightNotification();
         }
      },
      bindChatEvents: function () {
         var self = this;
         $(this.domEl.mainDiv).click(function (e) {
            self.unhighlightNotification();
         })
         $(this.domEl.textInput).focus(function (e) {
            self.unhighlightNotification();
         });
         $(this.domEl.textInput).keyup(function (e) {
            if (e.keyCode === 13) {
               self.sendMessage();
            }
         });
         $(this.domEl.closeButton).click(function (e) {
            self.removeConnection();
         });
      },
      highlightNotification: function () {
         this.domEl.mainDiv.addClass('message-notification');
      },
      unhighlightNotification: function () {
         this.domEl.mainDiv.removeClass('message-notification');
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
         closeEvent();
      },
      unbindEvents: function () {
         $(this.domEl.textInput).unbind();
         $(this.domEl.closeButton).unbind();
      },
      closeConnection: function () {
         this.conn.pubsub.unsubscribe(this.room_node, Strophe.getBareJidFromJid(this.user_jid));
      },
      removeDomElement: function () {
         $('.chat-windows-wrapper').find('div[data-group-id="' + this.room_node + '"]').remove();
      }
   }
   CHAT_BOX.init();
}