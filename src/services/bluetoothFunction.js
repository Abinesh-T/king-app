
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import EscPosEncoder from 'esc-pos-encoder';
import { getPermission } from './helperFunctions';


export const listDevices = async () => {
    try {
        getPermission()
        const list = await BluetoothSerial.list();
        console.log(list);
        return list;
    } catch (error) {
        console.log('Device searcg failed', error);

    }

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
export const printDevice = async (data, deviceId) => {
    const encoder = new EscPosEncoder();
    const commands = encoder
        .initialize()
        .text('The quick brown fox jumps over the lazy dog')
        .text('The quick brown fox jumps over the lazy dog')
        .text('The quick brown fox jumps over the lazy dog')
        .text('The quick brown fox jumps over the lazy dog')
        .newline()
        .qrcode('https://nielsleenheer.com')
        .newline()
        .cut()
        .encode();

    try {
        const { result, subscription } =await connectToDevice('DC:0D:30:68:A3:A7');
        console.log(result);
        await BluetoothSerial.write(commands, () => {
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