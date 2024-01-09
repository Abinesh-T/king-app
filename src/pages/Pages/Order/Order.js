import { Box, Flex, Text, useMantineTheme } from '@mantine/core';
import React, { useState } from 'react'
import SetOrder from './SetOrder';
import AppHeader from 'components/AppHeader';
import { IconCirclePlus } from '@tabler/icons';
import { DatePickerInput } from '@mantine/dates';

const Order = () => {
    const theme = useMantineTheme();
    const [isSetOrder, setIsSetOrder] = useState(false);
    const [orderDataInput, setOrderDataInput] = useState([]);
    const [date, setDate] = useState(new Date());

    console.log(orderDataInput);

    return (
        <div>
            <AppHeader />
            {isSetOrder ? <SetOrder setOrderDataInput={setOrderDataInput} setIsSetOrder={setIsSetOrder} /> :
                <>
                    <Box p={5}>
                        <Flex p={10} gap={10}>
                            <Text fz={"lg"} fw={600}>ORDER</Text>
                            <IconCirclePlus style={{ cursor: "pointer" }} onClick={() => { setIsSetOrder(true) }} color={theme.colors.brand[8]} />
                        </Flex>
                        <Box>
                            <DatePickerInput w={110} label="Select Date" value={date} onChange={setDate} />
                        </Box>
                    </Box>
                </>
            }
        </div>
    )
}

export default Order