from timetable_canvas_generator import timetable_canvas_generator
import pandas as pd
import streamlit as st

# Define the days of the week and time slots
days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
time_slots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

def convert_to_timetable(df):

    # Initialize the timetable with empty strings
    timetable = [['' for _ in range(len(time_slots))] for _ in range(len(days))]

    # Fill the timetable with course information
    for _, row in df.iterrows():

        day = row['day']
        start_time = row['start_time']
        end_time = row['end_time']
        course_info = f"{row['info']}"

        # Find the corresponding time slot index
        # start_index = time_slots.index(start_time.strftime('%H:%M')) # if it is datetime object
        # end_index = time_slots.index(end_time.strftime('%H:%M')) # if it is datetime object
        start_index = time_slots.index(start_time)
        end_index = time_slots.index(end_time)

        # Fill the timetable for the duration of the course
        for i in range(start_index, end_index):
            day_index = days.index(day)
            timetable[day_index][i] = course_info

    return timetable

# Create a simple new DataFrame
data = {'day': ['MONDAY', 'TUESDAY', 'WEDNESDAY'],
    'start_time': ['08:00', '09:00', '10:00'],
    'end_time': ['09:00', '10:00', '11:00'],
    'info': ['Math', 'Science', 'English']}
df = pd.DataFrame(data)

# Call the convert_to_timetable function
timetable = convert_to_timetable(df)

timetable_canvas_generator(timetable, timetableType=time_slots, Gheight=100, key="combination_1")
timetable_canvas_generator(timetable, timetableType=time_slots, Gheight=50, key="combination_2")