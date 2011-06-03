from django.http import HttpResponse
from django.shortcuts import render_to_response
from numberlink.contest.forms import ContestForm
from numberlink.contest.models import Contest
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.template import RequestContext

@login_required
@csrf_protect
def add(request):
    if request.method == 'POST':
        form = ContestForm(request.POST, request.FILES)
        form.author = ''
        if form.is_valid():
            contest = form.save(commit=False)
            contest.author = User.objects.get(username = request.session['user'])
            contest.save()
    else:
            form = ContestForm()
    return render_to_response("contest.html", {"form":form}, context_instance=RequestContext(request))
