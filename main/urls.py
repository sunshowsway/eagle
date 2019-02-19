from django.conf.urls import url, include
from main.views import *

urlpatterns = [
    url(r'add_server$', add_server),
    url(r'delete_server$', delete_server),
    url(r'edit_server$', edit_server),
    url(r'show_servers$', show_servers),
    url(r'test_connection$', test_connection),

    url(r'get_project_path$', get_project_path),
    url(r'do_deploy_project$', do_deploy_project),
    url(r'get_download_size$', get_download_size),
]
