
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';

// Check if the Bluetooth Serial plugin is available
const isAvailable = () => {
    return new Promise((resolve, reject) => {
        BluetoothSerial.isEnabled(
            () => resolve(true),
            () => reject('Bluetooth is not enabled')
        );
    });
};

// Scan for devices
const listDevices = () => {
    return new Promise((resolve, reject) => {
        BluetoothSerial.list(resolve, reject);
    });
};

// Connect to a device
const connect = (deviceId) => {
    return new Promise((resolve, reject) => {
        BluetoothSerial.connect(
            deviceId,
            () => resolve('Connected'),
            () => reject('Failed to connect')
        );
    });
};

// Disconnect from a device
const disconnect = () => {
    return new Promise((resolve, reject) => {
        BluetoothSerial.disconnect(resolve, reject);
    });
};

// Send data
const sendData = (data) => {
    return new Promise((resolve, reject) => {
        BluetoothSerial.write(
            data,
            () => resolve('Data sent'),
            () => reject('Failed to send data')
        );
    });
};

export const BluetoothService = {
    isAvailable,
    listDevices,
    connect,
    disconnect,
    sendData,
};