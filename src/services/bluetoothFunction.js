
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { getPermission } from './helperFunctions';


export const listDevices =  () => {
    return new Promise(async (resolve, reject) => {
        getPermission()
        const list = await BluetoothSerial.list();
        list ? resolve(list) : reject(list);

    });


}
async function connectToDevice(deviceId) {
    return new Promise((resolve, reject) => {
        getPermission()
        const subscription = BluetoothSerial.connect(deviceId).subscribe({
            next: (result) => {
                console.log('Device Connected');
                resolve({ result, subscription }); // Don't forget to unsubscribe
            },
            error: (err) => {
                console.log('Device Connection failed', err);
                reject(err);
                subscription.unsubscribe(); // Cleanup on error
            }
        });
    });
}
export const printDevice = async (data) => {
    try {
        const selectedDevice = JSON.parse(localStorage.getItem('printer'))
        const { result, subscription } =await connectToDevice(selectedDevice?.id);
        console.log(result);
        await BluetoothSerial.write(data, () => {
            console.log('Write Successful');
            subscription.unsubscribe(); // Unsubscribe after successful write
        }, (err) => {
            console.log('Write failed', err);
            subscription.unsubscribe(); // Ensure to unsubscribe even on failure
        });
    } catch (error) {
        console.log('Device Connection failed', error);
        
    }

}