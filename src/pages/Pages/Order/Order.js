import { Box, Flex, Text, useMantineTheme } from '@mantine/core';
import React, { useEffect, useMemo, useState } from 'react'
import SetOrder from './SetOrder';
import AppHeader from 'components/AppHeader';
import { IconCirclePlus, IconPlus } from '@tabler/icons';
import { DatePickerInput } from '@mantine/dates';
import { MantineReactTable } from 'mantine-react-table';
import FloatingMenu from 'components/FloatingMenu';

const Order = () => {
    const theme = useMantineTheme();
    const [isSetOrder, setIsSetOrder] = useState(false);
    const [orderDataInput, setOrderDataInput] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [date, setDate] = useState(new Date());


    useEffect(() => {
        if (orderDataInput.length === 4) {
            let data = {
                to_party: orderDataInput[2],
                bill_amount: orderDataInput[1][4],
                // date: orderDataInput[3],
            };
            setTableData([data]);
        }

        console.log(orderDataInput);
    }, [orderDataInput])


    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: "auto"
            },
            {
                accessorKey: 'to_party',
                header: 'Name',
                size: "auto"
            },
            {
                accessorKey: 'prev_bal',
                header: 'Previous Balance',
                size: "auto"
            },
            {
                accessorKey: 'bill_amount',
                header: 'Bill Amount',
                size: "auto"
            },
            {
                accessorKey: 'receivable_amount',
                header: 'Receivable Amount',
                size: "auto"
            },
            {
                accessorKey: 'received_amount',
                header: 'Received Amount',
                size: "auto"
            },
            {
                accessorKey: 'curr_bal',
                header: 'Current Balance',
                size: "auto"
            },
            {
                accessorKey: 'date',
                header: 'Date',
                size: "auto"
            },
            {
                header: 'Print',
                size: "auto"
            },
        ],
        [],
    );

    return (
        <div>
            {isSetOrder ? <>
                <AppHeader title="ADD ORDER" /><SetOrder setOrderDataInput={setOrderDataInput} setIsSetOrder={setIsSetOrder} /></> :
                <>
                    <AppHeader title="ORDER" />
                    <Box p={5}>
                        <Box mb={20}>
                            <DatePickerInput w={120} label="Select Date" value={date} onChange={setDate} />
                        </Box>
                        <MantineReactTable
                            columns={columns}
                            data={tableData}
                            positionActionsColumn='last'
                            enableRowActions
                        />
                    </Box>
                    <FloatingMenu
                        m={5}
                        right
                        size={50}
                        onClick={() => {
                            setIsSetOrder(true);
                        }}
                    >
                        <IconPlus color="white" />
                    </FloatingMenu>
                </>
            }

        </div>
    )
}

export default Order