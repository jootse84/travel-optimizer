from django.shortcuts import render
from django.http import HttpResponse
from planner.modules.grid import Grid
from planner.modules.map import Map
from functools import reduce

import json
import uuid
import math
import pdfkit

def plan(request):
    body = json.loads(request.body.decode('utf-8'))
    options = [(spot["name"], float(spot["duration"]), int(spot["rating"]))
                for spot in body['spots']]

    grid = Grid(options, int(body['days']), body["city"])
    optim_itinerary = sorted(grid.get_optim(), key=lambda k: k[1]) # sort by duration

    duration = reduce(lambda x, y: x + y, map(lambda k: k[1], optim_itinerary))
    itinerary =[{'label': 'Day {}'.format(str(day+1)), 'day': day, 'attractions': []}
        for day in range(math.ceil(duration))]

    # build dict with itinerary per days
    acum_time = 0
    for spot in optim_itinerary:
        for day in range(math.floor(acum_time), math.ceil(acum_time + spot[1])):
            itinerary[day]['attractions'].append({
                "spot": spot[0],
                "duration": spot[1],
                "rating": spot[2]
            })
        acum_time = acum_time + spot[1]

    result = {
        'duration': duration,
        'city': body["city"],
        'itinerary': itinerary
    }
    return HttpResponse(json.dumps(result), content_type='application/json')

def createMap(request):
    body = json.loads(request.body.decode('utf-8'))
    map_id = str(uuid.uuid4())

    attrs = {}
    for day in body['itinerary']:
        for attr in day['attractions']:
            name = attr['spot']
            if name in attrs:
                attrs[name]['days'].append(day['day'])
            else:
                attrs[name] = {
                    'days': [ day['day'] ]
                }

    newmap = Map(body["city"], attrs,
                    file_name="templates/maps/map_{}.html".format(map_id))
    newmap.create()

    return HttpResponse(json.dumps({'id': map_id}), content_type='application/json')

def renderMap(request):
    file_name = "maps/map_{}.html".format(request.GET['id'])
    return render(request, file_name, {})

def pdf(request):
    file_name = "maps/map_{}.html".format(request.GET['id'])
    pdfkit.from_file('test.html', 'out.pdf')
    return render(request, file_name, {})

def index(request):
    return render(request, "index.html", {})

