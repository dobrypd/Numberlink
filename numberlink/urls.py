from django.conf.urls.defaults import patterns, include, url
from django.conf import settings

#numberlink views
from numberlink.main.views import main

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    #main page
    url(r'^$', main),

    #admin
    url(r'^admin/', include(admin.site.urls)),

    #numberlink game
    url(r'^boards$', 'numberlink.game.views.boardlist'),
    url(r'^board/([A-Za-z]+)/$', 'numberlink.game.views.board'),
    url(r'^board/$', 'numberlink.game.views.boardlist'),
    url(r'^highscores/', 'numberlink.game.views.highscores'),

    #authorisation
    url(r'^accounts/login/', 'django.contrib.auth.views.login'),
    url(r'^accounts/ajaxlogin/$',  'numberlink.main.views.loginajax'),
    url(r'^accounts/logout/', 'django.contrib.auth.views.logout'),
)

if settings.DEBUG:
    urlpatterns += patterns('',
    	url(r'^static/(?P<path>.*)$', 'django.views.static.serve',
        	{'document_root': settings.STATIC_ROOT,
	        'show_indexes':True}),
    	url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
    	    {'document_root': settings.MEDIA_ROOT,
	        'show_indexes':True}),
    )