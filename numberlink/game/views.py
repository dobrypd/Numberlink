from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils import simplejson
from django.http import Http404
from django.contrib.auth.models import User
from django.views.decorators.cache import cache_page
from django.template import RequestContext
from game.models import Board, Score
from contest.models import Contest
from main.views import contests
import datetime

@cache_pae(60 * 5)
def highscores(request, contest):
    try:
        c = Contest.objects.get(id = contest)
    except Contest.DoesNotExist:
        raise Http404
    if request.method == 'POST':
        uname = request.user.username
        bname = request.POST['boardname']
        time = request.POST['time']
        try:
            u = User.objects.get(username=uname)
        except User.DoesNotExist:
            raise Http404
        try:
            b = Board.objects.get(name=bname)
        except Board.DoesNotExist:
            raise Http404
        time_sec = int(time)
        #1sprawdz czy jest najlepszy
        try: 
            #niezmiennik (jest tylko jeden old (tylko tutaj go zmieniam))
            old = c.score.get(board = b)
        except Score.DoesNotExist:
            s = Score(user=u, board = b, time_s = time_sec, date = datetime.datetime.now())
            s.save()
            c.highscores.add(s)
            return HttpResponse(simplejson.dumps(True), mimetype='application/json')
        if (old.time_s > time_sec):
            old.delete()
            s = c.highscores(user = u, board = b, time_s = time_sec, date = datetime.datetime.now())
            s.save()
            c.highscores.add(s)
            return HttpResponse(simplejson.dumps(True), mimetype='application/json')
        else:
            return HttpResponse(simplejson.dumps(False), mimetype='application/json')
    else:   
        scores = []
        for s in  c.highscores.order_by('time_s'):
            scores.append((s.board.name, s.user, str(s.time_s) + 's'))

        return render_to_response('highscores.html', 
                {'title': 'Najlepsze wyniki', 'scores': scores, 'contests':contests()}, context_instance=RequestContext(request)
            )

@login_required
def board(request, boardname):
    xhr = request.GET.has_key('xhr')

    try:
        b = Board.objects.get(name=boardname)
    except Board.DoesNotExist:
        raise Http404

    if xhr:
       return HttpResponse(b.json(), mimetype='application/json')

    return render_to_response('board.html', 
            {'title': 'Gra'}, context_instance=RequestContext(request)

        )

@login_required
def boardlist(request, contest = 1):
    option = request.GET.has_key('options')
    if option:
        boardsnames = []
        for b in Board.objects.all():
            boardsnames.append(b.name)
        return render_to_response('boardsoption.html', {'boardsnames': boardsnames})
    return render_to_response('board.html',
            {'title': 'Gra', 'contest':contest, 
            'contests':contests()}, context_instance=RequestContext(request)
        )
