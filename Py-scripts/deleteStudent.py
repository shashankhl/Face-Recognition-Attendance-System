import csv
import os
import re

input_file=''

def delete_rows_by_id( value_to_delete):
    id_column_index = 1

    with open(input_file, 'r+', newline='') as csvfile:
        reader = csv.reader(csvfile)
        lines = list(reader)
        print(lines)
        csvfile.seek(0)
        csvfile.truncate()

        for row in lines:
            if row and row[id_column_index] != value_to_delete:
                csvfile.write(','.join(row) + '\n')

folder_path = ''

def delete_images_by_pattern( pattern):
    for filename in os.listdir(folder_path):
        if re.match(pattern, filename):
            file_path = os.path.join(folder_path, filename)
            os.remove(file_path)
            print(f"Deleted: {filename}")

