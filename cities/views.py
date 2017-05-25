from django.http import HttpResponse

import wikipedia
import json
from cities.modules.cities import Cities
cities = Cities()

def index(request, query):
    return HttpResponse(json.dumps(cities.get(query)), content_type='application/json')

def getAttractionInfo(request, city, attraction):
    wiki = wikipedia.page(city + " " + attraction)
    print(wiki)
    result = {
        "summary": wiki.summary,
        "images": wiki.images,
        "url": wiki.url
#        "coordinates": wiki.coordinates
    }
    return HttpResponse(json.dumps(result), content_type='application/json')
