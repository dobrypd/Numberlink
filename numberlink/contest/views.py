from django.http import HttpResponse
from django.shortcuts import render_to_response
from numberlink.contest.forms import ContestForm
from numberlink.contest.models import Contest
from django.views.decorators.csrf import csrf_protect

@csrf_protect
def add(request):
    if request.method == 'POST':
        form = ContestForm(request.POST, request.FILES)
        form.author = ''
        if form.is_valid():
            form.save()
            # do something.
    else:
            form = ContestForm()
    return render_to_response("contest.html", {
                        "form": form})
