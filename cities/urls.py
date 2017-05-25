from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^(?P<query>[\w ]+)/$', views.index, name='index'),
    url(r'^(?P<city>[\w ]+)/attractions/(?P<attraction>[\w ]+)/$', views.getAttractionInfo, name='index'),
]
