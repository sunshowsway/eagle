# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class News(models.Model):
    title = models.CharField(max_length=300)
    source = models.CharField(max_length=80)
    publish_time = models.CharField(max_length=45)
    content = models.TextField()
    ip = models.CharField(max_length=50, default='-')
    time = models.CharField(max_length=20, default='-')
    size = models.CharField(max_length=100, default='-')


# Create your models here.
class Server(models.Model):
    name = models.CharField(max_length=50)
    ip = models.CharField(max_length=15)
    port = models.IntegerField()
    desc = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name


class Jobs(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20)
    people = models.CharField(max_length=10)
    address = models.CharField(max_length=20)
    publish_time = models.CharField(max_length=30)
    ip = models.CharField(max_length=50, default='-')
    time = models.CharField(max_length=20, default='-')
    size = models.CharField(max_length=100, default='-')

    def __unicode__(self):
        return self.name
