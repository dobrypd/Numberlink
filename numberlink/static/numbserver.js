$(function(){
  $(window).bind( 'hashchange', function(e) {
    
    var url = $.param.fragment();
    
    $( 'a.bbq-current' ).removeClass( 'bbq-current' );
    
    $( '.bbq-content' ).children( ':visible' ).hide();
    
    url && $( 'a[href="#' + url + '"]' ).addClass( 'bbq-current' );
      $( '.bbq-loading' ).show();
      
      if (url == '') {
        $('.bbq-item').show()
        $( '.bbq-loading' ).hide();
      } else {
        $( '<div class="bbq-item"/>' )
        .appendTo( '.bbq-content' )
        
        .load( url, function(){
          $( '.bbq-loading' ).hide();
        })
        .show();
      }
  })
  
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
                                        alert("Zalogowano :-)");


				}
				else 
					if (!ret[0]) 
						alert("Zła nazwa użytkownika lub hasło");
					else 
						if (ret[0] && !ret[1]) 
							alert("Login zajęty");
						else {
							alert('Zarejestrowano');
						}
			}
		)
		return false;
    });
}


$(document).ready(function(){
	$(".showMenu").click( function(event){
		if ($("#MainMenu").css('display') === 'none') {
			$("#MainMenu").show('slow');
		} else {
			$("#MainMenu").hide('slow');
		}
	});
});
