import serial
import csv
import os.path
import time


ser = serial.Serial('/dev/ttyUSB0',115200,bytesize=8, parity='N',stopbits=1, timeout=None)  # open serial port
print(ser.name)         # check which port was really used

#ser.write(b'hello')     # write a string
#serial.close()             # close port


#while(1):
#s=ser.readline()  # read up to /n
#s=str(s,'utf-8').rstrip('\r\n')
#list=s.split(',')
#print(list)
#
filename='data.csv'
file_exists = os.path.isfile(filename)

#with open(filename, mode='a') as csv_file:

csv_file=open(filename, mode='a')

fieldnames = ['time', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8','P1', 'P2','Mass','airFLow']
writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

if not file_exists:
    writer.writeheader()  # file doesn't exist yet, write a header

while(1):

    s=ser.readline()  # read up to /n
    s=str(s,'utf-8').rstrip('\r\n')
    list=s.split(',')




    if len(list)==13:
        print(list)
        with open(filename, mode='a') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

            writer.writerow({'time':list[0], 'T1':list[1], 'T2':list[2], 'T3':list[3], 'T4':list[4], 'T5':list[5], 'T6':list[6], 'T7':list[7], 'T8':list[8],'P1':list[9], 'P2':list[10],'Mass':list[11],'airFLow':list[12]})
            csv_file.close()
    time.sleep(3)