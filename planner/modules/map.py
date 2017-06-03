from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

import folium
import threading
import logging

class Map:
    geolocator = Nominatim()

    def __init__(self, city, locations, file_name='templates/map.html'):
        self.city = city
        self.file = file_name
        self.locations = locations

    def geocode(self, location, recursion=0):
        try:
            return self.geolocator.geocode(location)
        except GeocoderTimedOut as e:
            if recursion > 10: # max recursions
                raise e
            time.sleep(1) # wait a bit
            return self.geocode(location, recursion=recursion + 1)

    def create(self):
        gcode = self.geocode(self.city)
        try:
            mCluster = folium.Map(location=[gcode.latitude, gcode.longitude], zoom_start=13)
            marker_cluster = folium.MarkerCluster().add_to(mCluster)

            def worker(location, city, days):
                gcode = self.geocode(location + " " + city)
                colors = ["green", "red", "blue", "brown", "yellow", "orange", "purple"]
                try:
                    folium.Marker(
                        [gcode.latitude, gcode.longitude],
                        popup=location.title()+". "+str(len(days))+" day(s) in total visiting.",
                        icon=folium.Icon(color=colors[days[0] % len(colors)], icon='info-sign')
                    ).add_to(marker_cluster)

                except:
                    print('error retrieving location - {}'.format(location + " " + city))
                    pass
                return

            for location in self.locations.keys():
                worker(location, self.city, self.locations[location]['days'])
            mCluster.save(self.file)

        except:
            print('error retrieving city - {}'.format(city))
            return

    def createAsync(self):
        gcode = self.geocode(self.city)
        try:
            mCluster = folium.Map(location=[gcode.latitude, gcode.longitude], zoom_start=13)
            marker_cluster = folium.MarkerCluster().add_to(mCluster)

            def worker(location, city):
                gcode = self.geocode(location + " " + city)
                try:
                    folium.Marker([gcode.latitude, gcode.longitude], popup=location,
                        icon=folium.Icon(color="green", icon='no-sign')
                    ).add_to(marker_cluster)
                except:
                    print('error retrieving location - {}'.format(location + " " + city))
                    pass
                return

            def createMap(threads, file_name):
                for thread in threads:
                    thread.join()
                # all threads finished
                mCluster.save(file_name)

            threads = []
            for location in self.locations.keys:
                t = threading.Thread(name=location, target=worker, args=(location, self.city, ))
                threads.append(t)
                t.start()

            t = threading.Thread(name='createMap', target=createMap, args=(threads, self.file, ))
            t.start()

        except:
            print('error retrieving city - {}'.format(city))
            return
