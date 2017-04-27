from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^map', views.map, name='map'),
    url(r'^plan$', views.plan, name='plan'),
    url(r'^$', views.index, name='index'),
]
