from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^map', views.createMap, name='map'),
    url(r'^renderMap', views.renderMap, name='map'),
    url(r'^plan$', views.plan, name='plan'),
    url(r'^$', views.index, name='index'),
]
