from django.db import models
from numberlink.game.models import Board, Score
from django.contrib.auth.models import User

#contest
class Contest(models.Model):
    name = models.CharField(max_length=30)
    author = models.ForeignKey(User, related_name="author")
    start_date = models.DateField()
    expire_date = models.DateField()
    is_private = models.BooleanField() #if not private - on main page

    guests = models.ManyToManyField(User, related_name="guest")
    highscores = models.ManyToManyField(Score)
    boards = models.ManyToManyField(Board)
    def __unicode__(self):
        return self.name
