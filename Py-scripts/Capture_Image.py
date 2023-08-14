import csv
import os
import os.path

import cv2

# Take image function

def takeImages(i_d,Name,fid):


    Id = fid
    name = Name

    if(Id and name):
        cam = cv2.VideoCapture(0)
        
        cam.set(3,640)
        cam.set(4,480)
        imgBackground=cv2.imread('Resources/background.png')
        
        harcascadePath = "haarcascade_frontalface_default.xml"
        detector = cv2.CascadeClassifier(harcascadePath)
        sampleNum = 0
        
        # importing the mode images to list
        folderModePath='Resources/Modes'
        modePathList=os.listdir(folderModePath)
        imgModeList=[]
        for path in modePathList:
            imgModeList.append(cv2.imread(os.path.join(folderModePath,path)))
            
        modeType=0

        while(True):
            ret, img = cam.read()
            
            imgBackground[162:162+480,55:55+640]=img
            imgBackground[44:44+633,808:808+414]=imgModeList[modeType]
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = detector.detectMultiScale(gray, 1.3, 5, minSize=(30,30),flags = cv2.CASCADE_SCALE_IMAGE)
            for(x,y,w,h) in faces:
                cv2.rectangle(img, (x, y), (x+w, y+h), (10, 159, 255), 2)
                sampleNum = sampleNum+1
                cv2.imwrite("TrainingImage" + os.sep +name +"."+i_d+ "."+str(Id) + '.' +
                            str(sampleNum) + ".jpg", gray[y:y+h, x:x+w])
                cv2.imshow('Face Attendance', imgBackground)
            if cv2.waitKey(100) & 0xFF == ord('q'):
                break
            elif sampleNum > 100:
                imgBackground[44:44+633,808:808+414]=imgModeList[4]
                cv2.imshow('Face Attendance', imgBackground)
                cv2.waitKey(2000)
                break
        cam.release()
        cv2.destroyAllWindows()
        header=["FId","Id", "Name"]
        row = [Id,i_d, name]
        if(os.path.isfile("StudentDetails"+os.sep+"StudentDetails.csv")):
            with open("StudentDetails"+os.sep+"StudentDetails.csv", 'a+') as csvFile:
                writer = csv.writer(csvFile)
                writer.writerow(j for j in row)
            csvFile.close()
        else:
            with open("StudentDetails"+os.sep+"StudentDetails.csv", 'a+') as csvFile:
                writer = csv.writer(csvFile)
                writer.writerow(i for i in header)
                writer.writerow(j for j in row)
            csvFile.close()


