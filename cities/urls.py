from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^(?P<query>[\w ]+)/$', views.index, name='index'),
]
