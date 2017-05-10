import json

class Cities:
    file_path = 'cities/modules/cities.json'

    def __init__(self):
        with open(self.file_path) as data_file:    
            data = json.load(data_file)
            self.cities = [{ 'name': key, 'country': key, 'isCountry': True } for key in data.keys()]
            for key in data.keys():
                self.cities.extend(map(lambda name: {
                    'name': name,
                    'country': key,
                    'isCountry': False
                }, data[key]))

            # unique values
            self.cities = list(dict((v['name'] + v['country'], v) for v in self.cities).values())

    def get(self, str_filter, top=5):
        return list(filter(lambda city: str_filter.lower() in city['name'].lower(), self.cities))[:top]
