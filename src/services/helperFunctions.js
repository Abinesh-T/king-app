export const getAlteredSelectionItem = array => {
    let modifiedList = array.map(e => {
        return {
            label: e.code,
            value: e.id,
            id: e.id,
        };
    });
    return modifiedList;
};

export const getAlteredSelectionParty = array => {
    let modifiedList = array.map(e => {
        return {
            label: e.name,
            value: e.id,
            id: e.id,
            type: e.party_type
        };
    });
    return modifiedList;
};

export const getUserDetails = () => {
    return JSON.parse(localStorage.getItem("user"));
}
export const checkPlatform = () => {
    return new Promise((resolve, reject) => {
        document.addEventListener('deviceready', onDeviceReady, false);

        function onDeviceReady() {
            if (window.cordova && window.cordova.platformId === 'android' || window.cordova.platformId === 'ios') {
                resolve('Cordova');
            } else if (window.Capacitor) {
                resolve('Capacitor');
            } else {
                reject('Unknown platform');
            }
        }
    });
}
export const getPermission = () => {
    document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {
        // Ensure the plugins object exists
        if (!window.cordova || !window.cordova.plugins || !window.cordova.plugins.permissions) {
            console.error("Cordova plugins not available.");
            return;
        }
        // Check if permission is already granted
        window.cordova.plugins.permissions.checkPermission(window.cordova.plugins.permissions.BLUETOOTH_CONNECT, (status) => {
            if (!status.hasPermission) {
                // Request permission
                window.cordova.plugins.permissions.requestPermission(window.cordova.plugins.permissions.BLUETOOTH_CONNECT, (status) => {
                    if (!status.hasPermission) {
                        // Permission denied
                        console.error("Permission to use the bluetooth is not granted.");
                    }
                }, (err) => {
                    console.error(err);
                    window.cordova.plugins.permissions.requestPermission(window.cordova.plugins.permissions.BLUETOOTH_CONNECT);
                });
            }
        }, (err) => {
            console.error(err);
        });
    }
}