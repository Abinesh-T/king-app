import { Tabs } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import Rate from './Rate'
import General from './General'
import BluetoothDevice from './bluetoothDevice'
import { BluetoothService } from 'services/bluetoothService'

import React, { useEffect, useMemo, useRef, useState } from "react";

const Settings = () => {

    const [devices, setDevices] = useState([]);

    useEffect(() => {
        BluetoothService.isAvailable()
            .then(() => {
                BluetoothService.listDevices().then((device)=>{
                    console.log(device);
                    setDevices(device);
                });
            })
            .catch((error) => alert(error));
    }, []);

    return (
        <div>
            <AppHeader title="Settings" />
            <Tabs variant="outline" defaultValue="general">
                <Tabs.List>
                    <Tabs.Tab value="general">
                        General
                    </Tabs.Tab>
                    <Tabs.Tab value="rate">
                        Rate
                    </Tabs.Tab>
                    <Tabs.Tab value="rate">
                        BluetoothDevice
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="general">
                    <General />
                </Tabs.Panel>
                <Tabs.Panel value="rate">
                    <Rate />
                </Tabs.Panel>
                <Tabs.Panel value="bluetooth">
                    <BluetoothDevice />
                </Tabs.Panel>

            </Tabs>
        </div>
    )
}

export default Settings