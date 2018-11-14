# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


# Create your models here.
class Server(models.Model):
    name = models.CharField(max_length=50)
    ip = models.CharField(max_length=15)
    port = models.IntegerField()
    desc = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name


class Book(models.Model):
    book_name = models.CharField(max_length=64)
    add_time = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.book_name
