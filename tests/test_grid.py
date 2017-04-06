import pytest
from grid import Grid

def test_class():
    with pytest.raises(TypeError): 
        #  __init__() takes exactly 3 arguments (2 given)
        grid = Grid(5)
    with pytest.raises(TypeError): 
        #  TypeError: 'int' object is not iterable
        grid = Grid(2, 2)
    with pytest.raises(TypeError): 
        #  TypeError: 'int' object is not iterable
        grid = Grid([2], 2)

def test_result1():
    days = 2
    options = [("tour eiffel", 0.5, 8), ("louvre", 1.0, 7),
        ("notre dame", 0.5, 5), ("Pompidou", 0.5, 4),
        ("sacre coeur", 0.5, 6), ("molin rouge", 0.5, 5),
        ("disneyland", 1.0, 4), ("gare du nord", 0.5, 1)]
    grid = Grid(options, days)
    optim_itinerary = grid.get_optim()
    result = [('tour eiffel', 0.5, 8), ('notre dame', 0.5, 5),
        ('sacre coeur', 0.5, 6), ('molin rouge', 0.5, 5)]
    err_msg = "Not the expected optim {} / {}".format(optim_itinerary, result)
    assert optim_itinerary == result, err_msg

def test_result2():
    days = 2
    options = [("tour eiffel", 0.5, 8), ("louvre", 1.0, 17),
        ("notre dame", 0.5, 5), ("Pompidou", 0.5, 4),
        ("sacre coeur", 0.5, 6), ("molin rouge", 0.5, 5),
        ("disneyland", 1.0, 4), ("gare du nord", 0.5, 1)]
    grid = Grid(options, days)
    optim_itinerary = grid.get_optim()
    result = [('tour eiffel', 0.5, 8), ('louvre', 1.0, 17), ('sacre coeur', 0.5, 6)]
    err_msg = "Not the expected optim {} / {}".format(optim_itinerary, result)
    assert optim_itinerary == result, err_msg

