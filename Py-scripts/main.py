import Capture_Image
import deleteStudent
import Recognize
import Train_Image
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5000"]}})

@app.route('/capture', methods=['POST'])
def process_data():
    data = request.get_json() 
    i_d = data['input_value1']
    name = data['input_value2']
    fid=data['input_value3']
    print(i_d,name,fid)
    Capture_Image.takeImages(i_d,name,fid)
    Train_Image.TrainImages()
    return [i_d ,name,fid]

@app.route('/attendance', methods=['POST'])
def takeAttendance():
    data = request.get_json() 
    subCode = data['input_value1']
    Recognize.recognize_attendence(subCode)
    Recognize.AttendanceImport()
    return jsonify({"message": "Data received successfully"})

@app.route('/delete', methods=['POST'])
def deleteStudentData():
    data = request.get_json()
    i_d = data['input_value1']
    name = data['input_value2']
    pattern = fr'{name}\.{i_d}\.\d+\.\d+\.jpg'
    deleteStudent.delete_rows_by_id(i_d)
    deleteStudent.delete_images_by_pattern(pattern)
    return [i_d ,name]

if __name__ == '__main__':
    app.run()
