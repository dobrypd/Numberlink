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
    url(r'^boards/(?P<contest>\d+)/$', 'numberlink.game.views.boardlist'),
    url(r'^board/([A-Za-z]+)/$', 'numberlink.game.views.board'),
    url(r'^boards/$', 'numberlink.game.views.boardlist'),
    url(r'^highscores/(?P<contest>\d+)/$', 'numberlink.game.views.highscores'),

    #contest
    url(r'^contest/add/$', 'numberlink.contest.views.add'),

    #authorisation
    url(r'^accounts/profile/$', main),
    url(r'^accounts/external/profile/$', main),
    url(r'^accounts/login/', 'django.contrib.auth.views.login'),
    url(r'^accounts/ajaxlogin/$',  'numberlink.main.views.loginajax'),
    url(r'^accounts/logout/', 'django.contrib.auth.views.logout'),
    #external authorisation via facebook, openid etc.
    url(r'^accounts/external/', include('socialauth.urls')),
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
