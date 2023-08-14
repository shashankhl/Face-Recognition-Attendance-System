import datetime
import os
import time

import cv2
import firebase_admin
import numpy as np
import pandas as pd
from firebase_admin import credentials, db, storage

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "",
    'storageBucket': ""
})

bucket = storage.bucket()

def recognize_attendence(subCode):
    recognizer = cv2.face.LBPHFaceRecognizer_create()  # cv2.createLBPHFaceRecognizer()
    recognizer.read("./TrainingImageLabel/Trainner.yml")
    harcascadePath = "haarcascade_frontalface_default.xml"
    faceCascade = cv2.CascadeClassifier(harcascadePath)
    df = pd.read_csv("StudentDetails"+os.sep+"StudentDetails.csv")
    font = cv2.FONT_HERSHEY_SIMPLEX
    col_names = ['Id', 'Name', 'Date', 'Time','SubCode']
    attendance = pd.DataFrame(columns=col_names)

    # Initialize and start realtime video capture
    cam = cv2.VideoCapture(0)
    cam.set(3, 640)  # set video width
    cam.set(4, 480)  # set video height
    
    imgBackground=cv2.imread('Resources/background.png')
    
    # Define min window size to be recognized as a face
    minW = 0.1 * cam.get(3)
    minH = 0.1 * cam.get(4)
    
    # importing the mode images to list
    folderModePath='Resources/Modes'
    modePathList=os.listdir(folderModePath)
    imgModeList=[]
    for path in modePathList:
        imgModeList.append(cv2.imread(os.path.join(folderModePath,path)))

    modeType=0
    test=[]
    marked=False

    while True:
        _,im = cam.read()
        
        imgBackground[44:44+633,808:808+414]=imgModeList[modeType]
        
        gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
        faces = faceCascade.detectMultiScale(gray, 1.2, 5,minSize = (int(minW), int(minH)),flags = cv2.CASCADE_SCALE_IMAGE)
        for(x, y, w, h) in faces:
            cv2.rectangle(im, (x, y), (x+w, y+h), (10, 159, 255), 2)
            Id, conf = recognizer.predict(gray[y:y+h, x:x+w])
            
            if (100-conf) > 50:
                aa = df.loc[df['FId'] == Id]['Name'].values
                confstr = "  {0}%".format(round(100 - conf))
                tt =aa
            else:
                Id = '  Unknown  '
                tt = str(Id)
                confstr = "  {0}%".format(round(100 - conf))

            if (100-conf) > 65:
                ts = time.time()
                date = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d')
                timeStamp = datetime.datetime.fromtimestamp(ts).strftime('%H:%M:%S')
                aa = str(aa)[2:-2]
                i_d=fetchId(Id)
                attendance.loc[len(attendance)] = [i_d['sid'], aa, date, timeStamp,subCode]
                if(len(test)==0):
                    test.append(Id)
                    marked=True
                else:
                    for id in test:
                        if id!=Id:
                            test.insert(0,Id)
                            marked=True
                            break

            # id name adder
            tt = str(tt)[2:-2]
            if(100-conf) > 65:
                tt = "[Pass] "+tt  
                cv2.putText(im, str(tt), (x+5,y-5), font, 1, (255, 255, 255), 2)
                cv2.putText(im, str(confstr), (x + 5, y + h - 5), font,1, (0, 255, 0),1 )
                for id in test:
                    if id==Id and marked==True:
                        std=fetchdata(id)
                        array=fetchImage(std["sid"])
                        modeType=6
                        imgBackground[44:44+633,808:808+414]=imgModeList[modeType]
                        # attendance 
                        cv2.putText(imgBackground,str(std['sattd']),(861,125),cv2.FONT_HERSHEY_COMPLEX,1,(255,255,255),1)
                        # id 
                        cv2.putText(imgBackground, str(std['sid']), (945, 493),cv2.FONT_HERSHEY_COMPLEX, 0.8, (255, 255, 255), 2)
                        #subject code
                        cv2.putText(imgBackground, str(subCode), (1006, 550),
                                cv2.FONT_HERSHEY_COMPLEX, 0.8, (255, 255, 255), 2)
                        # name 
                        (w, h), _ = cv2.getTextSize(std['sname'], cv2.FONT_HERSHEY_COMPLEX, 1, 2)
                        offset = (414 - w) // 2
                        cv2.putText(imgBackground, str(std['sname']), (808 + offset, 445),cv2.FONT_HERSHEY_COMPLEX, 1, (50, 50, 50), 1)
                        # image 
                        imgStudent = cv2.imdecode(array, cv2.IMREAD_COLOR)
                        target_region = imgBackground[175:175 + 216, 909:909 + 216]
                        resized_imgStudent = cv2.resize(imgStudent, (target_region.shape[1], target_region.shape[0]))
                        # end
                        imgBackground[162:162+480,55:55+640]=im
                        imgBackground[175:175 + 216, 909:909 + 216] = resized_imgStudent
                        cv2.imshow('Face Attendance',imgBackground)
                        cv2.waitKey(3000)
                        modeType=2
                        imgBackground[44:44+633,808:808+414]=imgModeList[modeType]
                        imgBackground[162:162+480,55:55+640]=im
                        cv2.imshow('Face Attendance',imgBackground)
                        marked=False
                        cv2.waitKey(2000)

            # percentage printer
            if (100-conf) > 65:
                for id in test:
                    if id==Id:
                        modeType=3
                        imgBackground[44:44+633,808:808+414]=imgModeList[modeType]
            elif 50 < (100-conf) < 65:
                modeType=0
                imgBackground[44:44+633,808:808+414]=imgModeList[modeType]
                tt="Recognizing"
                cv2.putText(im, str(tt), (x+5,y-5), font, 1, (255, 255, 255), 2)
                cv2.putText(im, str(confstr), (x + 5, y + h - 5), font, 1, (0, 255, 255), 1)
            elif (100-conf) < 50:
                cv2.putText(im, str(tt), (x+5,y-5), font, 1, (255, 255, 255), 2)
                cv2.putText(im, str(confstr), (x + 5, y + h - 5), font, 1, (0, 255, 255), 1)
            else:
                cv2.putText(im, str(confstr), (x + 5, y + h - 5), font, 1, (0, 0, 255), 1)
            cv2.imshow('Face Attendance',imgBackground)


        attendance = attendance.drop_duplicates(subset=['Id'], keep='first')
        imgBackground[162:162+480,55:55+640]=im
        # imgBackground[44:44+633,808:808+414]=imgModeList[modeType]
        cv2.imshow('Face Attendance',imgBackground)
        if (cv2.waitKey(1) == ord('q')):
            break
    ts = time.time()
    date = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d')
    timeStamp = datetime.datetime.fromtimestamp(ts).strftime('%H:%M:%S')
    Hour, Minute, Second = timeStamp.split(":")
    fileName = "Attendance"+os.sep+"Attendance_"+subCode+"_"+date+"_"+Hour+"-"+Minute+"-"+Second+".csv"
    attendance.to_csv(fileName, index=False)
    print("Attendance Successful")
    cam.release()
    cv2.destroyAllWindows()


def fetchdata(id):
    user=db.reference("students").get()
    for key in user:
        if str(user[key]["fid"])==str(id):
            ref = db.reference(f'students/{key}')
            user[key]["sattd"]+=1
            ref.child('sattd').set(user[key]["sattd"])
            ssid=key
            break
    return user[ssid]

def fetchImage(id):
    bucket = storage.bucket()
    fileName=f'Images/{id}.jpeg'
    blob = bucket.get_blob(fileName)
    array = np.frombuffer(blob.download_as_string(), np.uint8)
    return array

def fetchId(id):
    user=db.reference("students").get()
    for key in user:
        if str(user[key]["fid"])==str(id):
            ssid=key
            break
    return user[ssid]

# Importing student attendance
def AttendanceImport():
    folderPath = 'Attendance'
    pathList = os.listdir(folderPath)
    imgList = []
    studentIds = []
    for path in pathList:
        imgList.append(cv2.imread(os.path.join(folderPath, path)))
        studentIds.append(os.path.splitext(path)[0])
        fileName = f'{folderPath}/{path}'
        bucket = storage.bucket()
        blob = bucket.blob(fileName)
        blob.upload_from_filename(fileName)