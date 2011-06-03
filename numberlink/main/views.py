# -*- coding: utf-8 -*- 

from django.shortcuts import render_to_response

from django.contrib.auth.decorators import login_required
from django.core.context_processors import csrf
from django.contrib.auth.models import User 
from django.contrib import auth
from django.utils import simplejson
from django.http import HttpResponse

from numberlink.contest.models import Contest

import datetime
from time import strftime, gmtime

def contests():
    contests_list = []
    for c in Contest.objects.all():
        contests_list.append((c.id, c.name))
    return contests_list

def main(request):
    """Cała zabawa - jeddyna strona ładowana
       reszta jest ładowana za pomocą AJAX'a
    """
    
    return render_to_response('main.html', 
            {'title':'Witaj!', 'contests':contests()}
        );

def logina(uname, upas, request):
    user = auth.authenticate(username=uname, password=upas)
    if user is not None and user.is_active:
        auth.login(request, user)
        if request.session.test_cookie_worked():
            request.session.delete_test_cookie()
            request.session['user'] = user.username
            request.session['logintime'] = strftime("%a, %d %b %Y %H:%M:%S", gmtime())
        return True
    return False

def loginajax(request):
      if request.method == "POST":
        name = request.POST['username']
        pas = request.POST['password']
        new = bool(int(request.POST['isnew']))
        if not new:
            return HttpResponse(simplejson.dumps((new, logina(name, pas, request))),
                                                    mimetype='application/json')
        else:
            try:
                new_user = User.objects.create_user(name, 'dummy@gummy.com', pas)
            except IntegrityError:
                return HttpResponse(simplejson.dumps((new, False)), mimetype='application/json')
            new_user.save()
            return HttpResponse(simplejson.dumps((new, logina(name, pas, request))),
                                                    mimetype='application/json')
      else:
        request.session.set_test_cookie()
        return render_to_response('accounts/login.html', {'logged': False}, context_instance=RequestContext(request))
