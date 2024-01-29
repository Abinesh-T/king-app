import { ActionIcon, Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { IconCirclePlus, IconDeviceFloppy, IconPrinter, IconX } from '@tabler/icons';
import { MantineReactTable } from 'mantine-react-table';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query';
import { api_all_item } from '../Item/item.service';
import { showErrorToast, showSuccessToast } from 'utilities/Toast';
import { api_add_order, api_edit_order } from './billing.service';
import { api_all_rate } from '../Settings/rate.service';

const SetOrder = (props) => {
    const theme = useMantineTheme();

    const [orderData, setOrderData] = useState([]);
    const [errorParty, setErrorParty] = useState(null);
    const [toParty, setToParty] = useState(null);
    const [footer, setFooter] = useState(["", "Total", "", "", "", ""]);
    const [date, setDate] = useState(new Date());


    const columns = useMemo(
        () => [
            {
                accessorKey: 'supplier_party',
                header: 'Supplier Party',
                size: 70,
            },
            {
                accessorKey: 'item',
                header: 'Item',
                size: 70,
            },
            {
                accessorKey: 'rate',
                header: 'Rate',
                size: 50
            },
            {
                accessorKey: 'qty',
                header: 'Qty',
                size: 50
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                size: 50
            },
        ],
        [],
    );

    return (<>
        <Box p={5} style={{ overflow: "hidden" }}>
            <Grid mb={5}>
                <Grid.Col span={6}>
                    <Select
                        value={toParty}
                        onChange={setToParty}
                        label="To Party"
                        placeholder="Select To Party"
                        searchable
                        error={errorParty}
                        data={props.partyData.filter((e, i) => e.type === "reciever")}
                    />
                    <DatePickerInput miw={110} label="Select Date" value={date} onChange={setDate} />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Flex h={"100%"} direction={"column"} align={"center"} justify={"space-evenly"}>
                        <Button w={100} size='xs' leftIcon={<IconDeviceFloppy />} onClick={() => {
                            let order_items = orderData?.filter((e, i) => (e.amount > 0) && (e.supplier_party));

                            if (toParty !== null && order_items.length) {
                                // addItem(orderData, footer, toParty, date);
                                setErrorParty(null);
                            } else {
                                if (toParty === null) {
                                    setErrorParty("Party Invalid");
                                } else {
                                    showErrorToast({ title: "Error", message: "Items not selected" })
                                    setErrorParty(null);
                                }
                            }
                        }}>SAVE</Button>
                        <Button w={100} size='xs' variant="outline" leftIcon={<IconX />} onClick={() => {
                            props.setEditingData(null);
                            setErrorParty(null);
                            props.setIsSetOrder(false);
                        }}>CANCEL</Button>
                    </Flex>
                </Grid.Col>
            </Grid>
            <MantineReactTable
                columns={columns}
                data={orderData}
                enableColumnActions={false}
                enablePagination={false}
                enableBottomToolbar={false}
                enableTopToolbar={false}
                // enableStickyFooter
                // enableStickyHeader
                mantineTableContainerProps={{
                    sx: {

                    }
                }}
                mantineTableBodyProps={{
                    sx: {
                        //stripe the rows, make odd rows a darker color
                        '& td:nth-of-type(odd)': {
                            padding: 0,
                            paddingLeft: 1,
                        }, '& td:nth-of-type(even)': {
                            padding: 0,
                            paddingLeft: 1,
                        },
                    },
                }}
                mantineTableProps={{
                    sx: {
                        tableLayout: 'fixed',
                    },
                }}
                mantineTableHeadProps={{
                    sx: {
                        //stripe the rows, make odd rows a darker color
                        '& th:nth-of-type(odd)': {
                            padding: 0,
                            paddingLeft: 1,
                            paddingTop: 5,
                            paddingBottom: 5,
                        }, '& th:nth-of-type(even)': {
                            padding: 0,
                            paddingLeft: 1,
                            paddingTop: 5,
                            paddingBottom: 5,
                        },
                    },
                }}
                mantineTableFooterProps={{
                    sx: {
                        //stripe the rows, make odd rows a darker color
                        '& th:nth-of-type(odd)': {
                            padding: 0,
                            paddingLeft: 1,
                            paddingTop: 5,
                            paddingBottom: 5,
                            width: "100%"
                        }, '& th:nth-of-type(even)': {
                            padding: 0,
                            paddingLeft: 1,
                            paddingTop: 5,
                            paddingBottom: 5,
                            width: "100%"
                        },
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        width: "100%"
                    },
                }}
            />
        </Box>
    </>
    )
}

export default SetOrder