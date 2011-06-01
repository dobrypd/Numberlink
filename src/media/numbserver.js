$(function(){
  
  // Keep a mapping of url-to-container for caching purposes.
  var cache = {
    // If url is '' (no fragment), display this div's content.
    '': $('#MainMenu')
  };
  
  // Bind an event to window.onhashchange that, when the history state changes,
  // gets the url from the hash and displays either our cached content or fetches
  // new content to be displayed.
  $(window).bind( 'hashchange', function(e) {
    
    // Get the hash (fragment) as a string, with any leading # removed. Note that
    // in jQuery 1.4, you should use e.fragment instead of $.param.fragment().
    var url = $.param.fragment();
    
    // Remove .bbq-current class from any previously "current" link(s).
    $( 'a.bbq-current' ).removeClass( 'bbq-current' );
    
    // Hide any visible ajax content.
    $( '.bbq-content' ).children( ':visible' ).hide();
    
    // Add .bbq-current class to "current" nav link(s), only if url isn't empty.
    url && $( 'a[href="#' + url + '"]' ).addClass( 'bbq-current' );
    
    if ( cache[ url ] ) {
      // Since the element is already in the cache, it doesn't need to be
      // created, so instead of creating it again, let's just show it!
      cache[ url ].show();
      
    } else {
      // Show "loading" content while AJAX content loads.
      $( '.bbq-loading' ).show();
      
      // Create container for this url's content and store a reference to it in
      // the cache.
      cache[ url ] = $( '<div class="bbq-item"/>' )
        
        // Append the content container to the parent container.
        .appendTo( '.bbq-content' )
        
        // Load external content via AJAX. Note that in order to keep this
        // example streamlined, only the content in .infobox is shown. You'll
        // want to change this based on your needs.
        .load( url, function(){
          // Content loaded, hide "loading" content.
          $( '.bbq-loading' ).hide();
        });
    }
  })
  
  // Since the event is only triggered when the hash changes, we need to trigger
  // the event now, to handle the hash the page may have loaded with.
  $(window).trigger( 'hashchange' );
  
});



$('html').ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
        // Only send the token to relative URLs i.e. locally.
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

var wantBoard = function() {
	$("#boardsoptions").load('/board/?options', function(response, status, xhr) {
		if (status == "error") {
			var msg = "Wystąpił błąd podczas ładowania: ";
			$("#boardsoptions").html(msg + xhr.status + " " + xhr.statusText);
	  	}
		init_numberlink();
	});
}

var showContent = function(what, dir){
	$("#MainMenu").hide('fast');
	$(".bbq-content").hide('fast');
	$(".bbq-content").load(dir+what+'/ #MainDIV', function(response, status, xhr) {
		if (status == "error") {
			var msg = "Wystąpił błąd podczas ładowania: ";
			$(".bbq-content").html(msg + xhr.status + " " + xhr.statusText);
			}
		switch(what){ //jak się załaduje to odpal:
			case 'board':
				wantBoard();
				break;
			case 'login':
				wantLogin();
				break;
		}
		wantLogin();
	});
	
	$(".bbq-content").show('slow');
}

function logout(){
	$(".bbq-content").load('accounts/logout/')
}

var wantLogin = function() {
	$("form").submit(function() {
		var nazwa = $('#id_username').val();
		var nowe = $('#isnew').attr('checked') ? 1 : 0;
		var haslo = $('#id_password').val();
		$.post('accounts/ajaxlogin/',
			{username: nazwa, password: haslo, isnew: nowe},
			function(json) {
				ret = eval(json);
				if ((ret[1] && !ret[0])) {
					showContent('board', '/');
				}
				else 
					if (!ret[0]) 
						alert("Zła nazwa użytkownika lub hasło");
					else 
						if (ret[0] && !ret[1]) 
							alert("Login zajęty");
						else {
							alert('Zarejestrowano');
							showContent('board', '/');
						}
			}
		)
		return false;
    });
}



var mouseEvent_showInContent = function(what, dir){
	$(".show" + what).click( function(event){
		showContent(what, dir);
	});
}


$(document).ready(function(){
	$("#MainMenu").show('slow');
	
	mouseEvent_showInContent('highscores', '/');
	mouseEvent_showInContent('board', '/');
	
	mouseEvent_showInContent('login', '/accounts/');
	mouseEvent_showInContent('logout', '/accounts/');
	
	$(".showMenu").click( function(event){
		if ($("#MainMenu").css('display') === 'none') {
			$("#MainMenu").show('slow');
		} else {
			$("#MainMenu").hide('slow');
		}
	});
});
