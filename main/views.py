# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from main.models import Book, Server
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt

import requests
import json
import socket
import os
import re


# Create your views here.

# this method add a new server.
@require_http_methods(["POST"])
@csrf_exempt
def add_server(request):
    response = {}
    try:
        server = Server(
            name=request.POST['name'],
            ip=request.POST['ip'],
            port=request.POST['port'],
            desc=request.POST.get('desc', ''),
        )
        server.save()
        response['msg'] = 'success'
        response['error_num'] = 0
    except Exception, e:
        response['msg'] = str(e)
        response['error_num'] = 1

    return JsonResponse(response)


# this method delete the server pointed by "request.POST['id']".
@require_http_methods(["POST"])
@csrf_exempt
def delete_server(request):
    response = {}
    try:
        sid = request.POST.get('id', '')
        if sid == '':
            raise Exception('no server id found')
        server = Server.objects.get(id=sid)
        server.delete()
        response['msg'] = 'success'
        response['error_num'] = 0
    except Exception, e:
        response['msg'] = str(e)
        response['error_num'] = 1

    return JsonResponse(response)


# this method edit the server pointed by "request.POST['id']".
@require_http_methods(["POST"])
@csrf_exempt
def edit_server(request):
    response = {}
    try:
        sid = request.POST.get('id', '')
        server = Server.objects.get(id=sid)

        if server is None:
            raise Exception('server not found')

        server.name = request.POST['name']
        server.ip = request.POST['ip']
        server.port = request.POST['port']
        server.desc = request.POST.get('desc', '')
        server.save()
        response['msg'] = 'success'
        response['error_num'] = 0
    except Exception, e:
        response['msg'] = str(e)
        response['error_num'] = 1

    return JsonResponse(response)


# this method return a server list contains all servers' info.
@require_http_methods(["GET"])
def show_servers(request):
    response = {}
    try:
        servers = Server.objects.filter()
        response['list'] = json.loads(serializers.serialize("json", servers))
        response['msg'] = 'success'
        response['error_num'] = 0
    except Exception, e:
        response['msg'] = str(e)
        response['error_num'] = 1

    return JsonResponse(response)


# this method tests whether host:port is open.
# if the socket.connect_ex return 0, the Port is open. otherwise the Port is closed
@require_http_methods(["POST"])
@csrf_exempt
def test_connection(request):
    response = {}
    try:
        host = request.POST.get('host', '')
        port = request.POST.get('port', 0)
        if host == '' or port == 0:
            raise Exception('host and port is required')

        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex((host, int(port)))

        response['msg'] = 'success'
        response['connect_status'] = result
        response['error_num'] = 0
    except Exception, e:
        response['msg'] = str(e)
        response['error_num'] = 1

    return JsonResponse(response)


@require_http_methods(["GET"])
def get_project_path(request):
    response = {}
    try:
        rootPath = request.GET.get('root', '')
        if rootPath is '':
            raise Exception('root path is undefined')

        path_dict = {}
        if os.path.exists(rootPath):
            for f in os.listdir(rootPath):
                file_path = os.path.join(rootPath, f)
                if os.path.isdir(file_path):
                    path_array = os.path.split(file_path)
                    path_dict[path_array[1]] = file_path

        response['paths'] = path_dict
        response['msg'] = 'success'
        response['error_num'] = 0
    except Exception, e:
        response['msg'] = str(e)
        response['error_num'] = 1

    return JsonResponse(response)


@require_http_methods(["POST"])
@csrf_exempt
def do_deploy_project(request):
    response = {}
    try:
        path = request.POST.get('path', '')
        project = request.POST.get('project', '')
        target = request.POST.get('target', '')
        version = request.POST.get('version', '')

        target_url = target + '/addversion.json'

        cfg_content = ['# Automatically created by: scrapy startproject\n',
                       '#\n',
                       '# For more information about the [deploy] section see:\n',
                       '# https://scrapyd.readthedocs.io/en/latest/deploy.html\n\n',
                       '[settings]\n',
                       'default = ' + project + '.settings\n\n',
                       '[deploy:' + target + ']\n',
                       'url = http://' + target_url + '\n',
                       'project = ' + project + '\n']

        with open(path + '/scrapy.cfg', "r+") as f:
            f.truncate()
            f.seek(0)
            f.writelines('# Automatically created by: scrapy startproject')
            f.writelines(cfg_content)
            f.close()

        d_output = os.popen('cd ' + path + ';'
                                           'scrapyd-deploy ' + target + ';').read()
        d_output = d_output.replace("\"", "")
        d_output = d_output.replace("\n", "")

        pattern = re.compile(
            '^{node_name:\s([\d]{1,3}.[\d]{1,3}.[\d]{1,3}.[\d]{1,3}),\sstatus:\s([\w]+),\sproject:\s([\w]+),\sversion:\s([\d]+),\sspiders:\s([\d]+)}$')
        match = pattern.match(d_output)

        deploy_result = {}
        if match:
            deploy_result['node_name'] = match.group(1)
            deploy_result['status'] = match.group(2)
            deploy_result['project'] = match.group(3)
            deploy_result['version'] = match.group(4)
            deploy_result['spiders'] = match.group(5)

        response['msg'] = 'success'
        response['deploy_result'] = deploy_result
        response['error_num'] = 0
    except Exception, e:
        response['msg'] = str(e)
        response['error_num'] = 1

    return JsonResponse(response)
