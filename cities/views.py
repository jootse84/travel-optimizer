from django.http import HttpResponse

import json
from cities.modules.cities import Cities
cities = Cities()

def index(request, query):
    return HttpResponse(json.dumps(cities.get(query)), content_type='application/json')
