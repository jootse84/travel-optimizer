from django.shortcuts import render
from django.http import HttpResponse
from planner.modules.grid import Grid
from planner.modules.map import Map

import json
import uuid

def plan(request):
    body = json.loads(request.body.decode('utf-8'))
    map_id = str(uuid.uuid4())
    options = [(spot["name"], float(spot["duration"]), int(spot["rating"]))
                for spot in body['spots']]

    grid = Grid(options, int(body['days']), body["city"])
    optim_itinerary = []
    for spot in grid.get_optim():
        optim_itinerary.append({
            "spot": spot[0],
            "duration": spot[1],
            "rating": spot[2],
            "content": spot[3],
            "image": spot[4],
            "city": body["city"]
        })

    result = {}
    result['itinerary'] = sorted(optim_itinerary, key=lambda k: k['duration'])
    result['city'] = body["city"]
    result['map'] = map_id

    newmap = Map(body["city"], [loc['spot'] for loc in result['itinerary']],
                    file_name="templates/maps/map_{}.html".format(map_id))
    newmap.create()

    return HttpResponse(json.dumps(result), content_type='application/json')

def map(request):
    file_name = "maps/map_{}.html".format(request.GET['id'])
    return render(request, file_name, {})

def index(request):
    return render(request, "index.html", {})

