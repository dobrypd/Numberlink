from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils import simplejson
from django.http import Http404
from django.contrib.auth.models import User
from django.views.decorators.cache import cache_page

from game.models import Board, Score
from main.views import contests
import datetime

@cache_page(60 * 5)
def highscores(request, contest):
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
            old = Score.objects.get(board = b)
        except Score.DoesNotExist:
            s = Score(user=u, board = b, time_s = time_sec, date = datetime.datetime.now())
            s.save()
            return HttpResponse(simplejson.dumps(True), mimetype='application/json')
        if (old.time_s > time_sec):
            old.delete()
            s = Score(user = u, board = b, time_s = time_sec, date = datetime.datetime.now())
            s.save()
            return HttpResponse(simplejson.dumps(True), mimetype='application/json')
        else:
            return HttpResponse(simplejson.dumps(False), mimetype='application/json')
    else:   
        scores = []
        for s in  Score.objects.order_by('time_s'):
            scores.append((s.board.name, s.user, str(s.time_s) + 's'))

        return render_to_response('highscores.html', 
                {'title': 'Najlepsze wyniki', 'scores': scores, 'contests':contests()}
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
            {'title': 'Gra'}
        )

@login_required
def boardlist(request, contest = 0):
    option = request.GET.has_key('options')
    if option:
        boardsnames = []
        for b in Board.objects.all():
            boardsnames.append(b.name)
        return render_to_response('boardsoption.html', {'boardsnames': boardsnames})
    return render_to_response('board.html',
            {'title': 'Gra', 'contests':contests()}
        )
