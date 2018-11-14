# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-11-10 07:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Server',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('ip', models.CharField(max_length=15)),
                ('port', models.IntegerField()),
                ('desc', models.CharField(max_length=200)),
                ('addDate', models.DateField(verbose_name='date added')),
                ('lastDate', models.DateField(verbose_name='the last datetime connected')),
            ],
        ),
    ]
