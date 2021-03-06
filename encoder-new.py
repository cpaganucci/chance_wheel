#!/usr/bin/env python

"""Copyright 2010 Phidgets Inc.
This work is licensed under the Creative Commons Attribution 2.5 Canada License. 
To view a copy of this license, visit http://creativecommons.org/licenses/by/2.5/ca/
"""

__author__ = 'Adam Stelmack'
__version__ = '2.1.8'
__date__ = 'May 17 2010'

#Basic imports
from ctypes import *
import sys
#Phidget specific imports
from Phidgets.PhidgetException import PhidgetErrorCodes, PhidgetException
from Phidgets.Events.Events import AttachEventArgs, DetachEventArgs, ErrorEventArgs, EncoderPositionChangeEventArgs, InputChangeEventArgs
from Phidgets.Devices.Encoder import Encoder

from socketIO_client import SocketIO
from socketIO_client import SocketIOPacketError


#Create an accelerometer object
try:
    encoder = Encoder()
except RuntimeError, e:
    print("Runtime Exception: %s" % e.details)
    print("Exiting....")
    exit(1)

#socket connection
socketIO = None
def connectSocket():
    try:
        print("Connecting to socket...")
        socketIO = SocketIO('localhost', 1338)
    except:
        print("Error connecting socket")

#Information Display Function
def displayDeviceInfo():
    print("|------------|----------------------------------|--------------|------------|")
    print("|- Attached -|-              Type              -|- Serial No. -|-  Version -|")
    print("|------------|----------------------------------|--------------|------------|")
    print("|- %8s -|- %30s -|- %10d -|- %8d -|" % (encoder.isAttached(), encoder.getDeviceName(), encoder.getSerialNum(), encoder.getDeviceVersion()))
    print("|------------|----------------------------------|--------------|------------|")

#Event Handler Callback Functions
def encoderAttached(e):
    attached = e.device
    print("Encoder %i Attached!" % (attached.getSerialNum()))

def encoderDetached(e):
    detached = e.device
    print("Encoder %i Detached!" % (detached.getSerialNum()))

def encoderError(e):
    try:
        source = e.device
        print("Encoder %i: Phidget Error %i: %s" % (source.getSerialNum(), e.eCode, e.description))
    except PhidgetException as e:
        print("Phidget Exception %i: %s" % (e.code, e.details))

def encoderInputChange(e):
    source = e.device
    print("Encoder %i: Input %i: %s" % (source.getSerialNum(), e.index, e.state))

def encoderPositionChange(e):
    source = e.device
    print("Encoder %i: Encoder %i -- Change: %i -- Time: %i -- Position: %i" % (source.getSerialNum(), e.index, e.positionChange, e.time, encoder.getPosition(e.index)))
    #with SocketIO('localhost', 1338) as socketIO:
    try:
        if socketIO != None:
            socketIO.emit('event', { 'type': 'encoder', 'val': e.positionChange })
        else:
            print("Socket not connected")
            connectSocket()
    except SocketIOPacketError as e:
        print("Error communicating to socket")
        connectSocket()


#Main Program Code
try:
    encoder.setOnAttachHandler(encoderAttached)
    encoder.setOnDetachHandler(encoderDetached)
    encoder.setOnErrorhandler(encoderError)
    encoder.setOnInputChangeHandler(encoderInputChange)
    encoder.setOnPositionChangeHandler(encoderPositionChange)
except PhidgetException as e:
    print("Phidget Error %i: %s" % (e.code, e.details))
    exit(1)

print("Opening phidget object....")

try:
    encoder.openPhidget()
except PhidgetException as e:
    print("Phidget Error %i: %s" % (e.code, e.details))
    exit(1)

print("Waiting for attach....")

try:
    encoder.waitForAttach(10000)
except PhidgetException as e:
    print("Phidget Error %i: %s" % (e.code, e.details))
    try:
        encoder.closePhidget()
    except PhidgetException as e:
        print("Phidget Error %i: %s" % (e.code, e.details))
        exit(1)
    exit(1)
else:
    displayDeviceInfo()

print("Press Enter to quit....")

chr = sys.stdin.read(1)

print("Closing...")

try:
    encoder.closePhidget()
except PhidgetException as e:
    print("Phidget Error %i: %s" % (e.code, e.details))
    print("Exiting....")
    exit(1)

print("Done.")
exit(0)