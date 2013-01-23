counter = {
  c : {},
  count : function(x) {
    this.c[x] =  this.c[x] + 1 || 1
  },
  keys : function() {
    var result = [];
    for(var i in this.c) {
       result.push( i );
    }
    return result;
  }
}

$(function(){

  var me;
  var messages;
  var users = {};

  function show_status( response ) {
    console.dir(response);
    $('#output_status').append( response.status + "\n");
    if (response.status === 'connected') {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token 
        // and signed request each expire
        var uid = response.authResponse.userID;
        var accessToken = response.authResponse.accessToken;
        $('.fb-login').hide();
        $('.fb-logout').show();
        FB.api('/me', function(response) {
           me = response;
           // $('#output_status').append( JSON.stringify( response, undefined, 2) );
           $('#output_status').append('Your name is ' + response.name+ "\n");
           $('#output_status').append('Your id is ' + response.id+ "\n");
        });
        FB.api({
          method: 'fql.query',
          query: 'SELECT body, author_id, source, viewer_id, created_time FROM message WHERE thread_id IN (SELECT thread_id FROM thread WHERE folder_id IN(0,1)) ORDER BY created_time'
        }, function(response){
           messages = response;

           if( !messages || ! messages.length > 0 ) {
               $('#output_status').append( "could not read messages! ... good for you!\n");
           } else {
               $('#output_status').append( messages.length + " messages read\n");
               $('#no').html( messages.length );
               for (var i in messages){
                 counter.count(messages[i]["author_id"]);
                 counter.count(messages[i]["viewer_id"])
               }
               var fql = 'SELECT uid, name, pic_with_logo FROM user WHERE uid IN (';
               var uids = counter.keys();
               for (var i in uids) {
                 fql += uids[i];
                 fql += ",";
               }
               fql = fql.substr(0, fql.length-1)
               fql += ")";
               FB.api({
                 method: 'fql.query',
                 query: fql
                }, function(response){
                   $('#output_status').append( response.length + " names of users read\n");
                   for(var i in response) {
                      var uid=response[i]['uid'];
                      users[uid] = response[i];
                      // $('#messages ul').append("<li><a href='#" + uid + "'>" + users[uid]['name'] + "</a></li>");
                      $('#messages').append("<div id='" + uid + "' class='mbox'></div>");
                   }
                   // $('#output_status').append( JSON.stringify( users, undefined, 2) );
                   // $('#output_status').append( JSON.stringify( me, undefined, 2) );
                   for(var i in messages) {
                      var from = users[ messages[i]["author_id"] ];
                      var to   = users[ messages[i]["viewer_id"] ];
                      var other = ( from['uid'] == me['id'] ? to : from );
                      var href_from = "href='https://facebook.com/" + from["uid"] + "'";
                      if( from['uid'] != to['uid'] ) {
                      $('#' + other['uid']).append(
                        $("<article class='clearfix'><a class='pull-left' " + href_from + ">" +
                        "<img class='media-object' src='" + from["pic_with_logo"] + "'></a>" +
                        "<div class='media-body'><h4 class='media-heading'>From: <a " + href_from + ">" +
                        from["name"] + "</a><br>" +
                        "To: "   +   to["name"] + "<br>" +
                        "Date: " + ("" + new Date( 1000 * messages[i]["created_time"] )).substr(0,21) + "</h4>"+
                        "\n" + messages[i]["body"] + "</div></article>")
                      );
                      }
                   }
                });
           }
        });
    } else if (response.status === 'not_authorized') {
        // the user is logged in to Facebook, 
        // but has not authenticated your app
        $('.fb-login').show();
        $('.fb-logout').hide();
    } else {
        // the user isn't logged in to Facebook.
        $('.fb-login').show();
        $('.fb-logout').hide();
    }
    if (response.session) {
        if (response.scope) {
            // user is logged in and granted some permissions.
            // scope is a comma separated list of granted permissions
        } else {
            // user is logged in, but did not grant any permissions
        }
    } else {
        // user is not logged in
    }
  }

  function check_status() {
      FB.getLoginStatus( show_status );
  }
  FB.Event.subscribe( 'auth.login', function( response ) {
     show_status( response );
  });

  check_status();

  $('.fb-login').on('click', function(e) {
    FB.login( show_status, {scope:'email,manage_notifications,read_mailbox'});
    e.preventDefault();
  });
  $('.fb-logout').on('click', function(e) {
    FB.logout( show_status );
    e.preventDefault();
  });


});
