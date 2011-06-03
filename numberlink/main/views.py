# -*- coding: utf-8 -*- 

from django.shortcuts import render_to_response

from django.contrib.auth.decorators import login_required
from django.core.context_processors import csrf
from django.contrib.auth.models import User 
from django.contrib import auth
from django.utils import simplejson
from django.http import HttpResponse
from django.template import RequestContext

from numberlink.contest.models import Contest

import datetime
from time import strftime, gmtime

def contests(user):
    contests_list = []
    for c in Contest.objects.all():
        then = c.start_date
        expire = c.expire_date
        now = datetime.date.today()
        expire_str = ' : trwa'
        if (now > expire):
            expire_str = ' : zakonczony'
        if (now >= then):   #wyswietlaj tylko juz rozpoczete
            if (c.is_private):  #wyswietlaj tylko jak jestem gosciem jestli prywatny
                try:
                    find = c.guests.get(id = user.id)
                    contests_list.append((c.id, str(c.name + ' - prywatny' + expire_str)))
                except :
                    pass
            else:
                contests_list.append((c.id, c.name + expire_str))
    return contests_list

def main(request):
    return render_to_response('main.html', 
            {'title':'Witaj!', 'contests':contests(request.user)}, context_instance=RequestContext(request)
        );

def logina(uname, upas, request):
    user = auth.authenticate(username=uname, password=upas)
    if user is not None and user.is_active:
        auth.login(request, user)
        if request.session.test_cookie_worked():
            request.session.delete_test_cookie()
            request.session['user'] = user;
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
