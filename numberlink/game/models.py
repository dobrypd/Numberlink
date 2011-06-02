from django.db import models
from django.contrib.auth.models import User
from django.utils import simplejson

#1. plansze:
class Board(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=2500)
    width = models.IntegerField()
    height = models.IntegerField()
    def json(self):
        return simplejson.dumps({'name':self.name, 'description':self.description,
                'width':self.width, 'height': self.height})
    def __unicode__(self):
        return self.name;

#2. wyniki
class Score(models.Model):
    user = models.ForeignKey(User)
    board = models.ForeignKey(Board)
    time_s = models.IntegerField()
    date = models.DateField()

    def __unicode__(self):
        return str(self.contest) + '-> '+ str(self.user) + ' on ' + str(self.board)
