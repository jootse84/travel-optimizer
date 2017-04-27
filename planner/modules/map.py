from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

import folium
import threading
import logging

class Map:
    geolocator = Nominatim()

    def __init__(self, city, locations, file_name='templates/map.html'):
        self.city = city
        self.lat = self.getLat(city)
        self.long = self.getLong(city)
        self.file = file_name
        self.locations = locations

    def getLat(self, city):
        return 41.390205

    def getLong(self, city):
        return 2.154007

    def geocode(self, location, recursion=0):
        try:
            return self.geolocator.geocode(location)
        except GeocoderTimedOut as e:
            if recursion > 10: # max recursions
                raise e
            time.sleep(1) # wait a bit
            return self.geocode(location, recursion=recursion + 1)

    def create(self):
        mCluster = folium.Map(location=[self.lat, self.long], zoom_start=13)
        marker_cluster = folium.MarkerCluster().add_to(mCluster)

        def worker(location, city):
            gcode = self.geocode(location + " " + city)
            try:
                folium.Marker([gcode.latitude, gcode.longitude], popup=location,
                    icon=folium.Icon(color="green", icon='no-sign')
                ).add_to(marker_cluster)
            except:
                pass
            return

        def createMap(threads, file_name):
            for thread in threads:
                thread.join()
            # all threads finished
            mCluster.save(file_name)

        threads = []
        for location in self.locations:
            t = threading.Thread(name=location, target=worker, args=(location, self.city, ))
            threads.append(t)
            t.start()

        t = threading.Thread(name='createMap', target=createMap, args=(threads, self.file, ))
        t.start()

