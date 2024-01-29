import { Tabs } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import React from 'react'
import Rate from './Rate'
import General from './General'

const Settings = () => {
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
                </Tabs.List>
                <Tabs.Panel value="general">
                    <General />
                </Tabs.Panel>
                <Tabs.Panel value="rate">
                    <Rate />
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}

export default Settings