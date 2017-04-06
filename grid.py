"""
Optimizing your travel itinerary
--------------------------------
For each thing you want to see, you write down how long it will take
and rate how much you want to see it.
"""

import numpy as np

class Grid:
    
    def __init__(self, itinerary, length):
        """Initialize the grid
        Parameters
        ----------
        itinerary: set of tuples.
          ("Name", duration respecting a day, value from scale zero to ten)
          For example, visit the liberty statue takes half a day and I rate
          it as an 8.
          i.e. ("Liberty statue", 1/2, 8)

        length: float length of the trip
          i.e. 5.5 (5 days and a half)
        """
        self.itinerary = [(n, int(2*t), r) for (n, t, r) in itinerary]
        self.buckets = length * 2 # length of the trip in buckets of half day
        self.grid = np.zeros([len(itinerary), self.buckets], dtype=object)


    def find_previous_bucket(row, col, prev_max):
        result = self.grid[row - 1][0]
        for e in reversed(self.grid[row - 1][1:col]):
            if e[0] != prev_max[0]:
                result = e
        return result


    def optimize(self):
        #import pdb
        #pdb.set_trace()
        total = len(self.itinerary)
        time_spent = lambda spots: sum([x[1] for x in spots])
        score = lambda spots: sum([x[2] for x in spots])
        self.grid[0] = [[self.itinerary.pop()]] * self.buckets # complete first row

        for row in range(1, total):
            current = self.itinerary.pop()
            current_time = time_spent([current])
            for col in range(self.buckets):
                # the previous max VS actual (value of current item + value remaining)
                prev_max = self.grid[row - 1][col]
                prev_max_time = time_spent(prev_max)
                self.grid[row][col] = prev_max

                # calculate actual (value of current + remaining)
                actual = [current]
                actual_time = current_time
                if (col + 1) > actual_time:
                    # there is remaining time, let's include the remaining value
                    remaining = self.grid[row - 1][col - actual_time]
                    actual = actual + remaining
                    actual_time = time_spent(actual)

                if score(actual) > score(prev_max):
                    self.grid[row][col] = actual
                elif score(actual) < score(prev_max):
                    self.grid[row][col] = prev_max
                elif len(actual) > len(prev_max):
                    # both same score, but actual visit more spots
                    self.grid[row][col] = actual
                else:
                    self.grid[row][col] = prev_max

    def get_optim(self):
        self.optimize()
        shape = self.grid.shape
        optim = self.grid[shape[0] - 1][shape[1] - 1]
        optim = map(lambda x: (x[0], float(x[1]) / 2, x[2]), optim)
        return optim
