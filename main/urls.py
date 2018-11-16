from django.conf.urls import url, include
import views

urlpatterns = [
    url(r'add_server$', views.add_server),
    url(r'delete_server$', views.delete_server),
    url(r'edit_server$', views.edit_server),
    url(r'show_servers$', views.show_servers),
    url(r'test_connection$', views.test_connection),

    url(r'get_project_path$', views.get_project_path),
    url(r'do_deploy_project$', views.do_deploy_project),
    url(r'get_download_size$', views.get_download_size),
]
