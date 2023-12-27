import { ActionIcon, Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import { MantineReactTable } from 'mantine-react-table';
import React, { useEffect, useMemo, useState } from 'react'

const Order = () => {
    const theme = useMantineTheme();
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        let order = [
            {
                item_code: "item1",
            },
            {
                item_code: "item2",
            },
            {
                item_code: "item3",
            },
            {
                item_code: "item4",
            },
        ]
        setOrderData(order);
    }, [])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'supplier_party',
                header: 'Supplier Party',
                size: "auto",
                Cell: ({ cell }) => {
                    return <div>
                        <Select
                            placeholder="Select Party"
                            data={[
                                { value: 'Party 1', label: 'Party 1' },
                                { value: 'Party 2', label: 'Party 2' },
                                { value: 'Party 3', label: 'Party 3' },
                            ]}
                        />
                    </div>;
                },
            },
            {
                accessorKey: 'item_code',
                header: 'Item Code',
                size: "auto"
            },
            {
                accessorKey: 'box',
                header: 'Box',
                size: "auto",
                Cell: ((cell) => {
                    return <div>
                        <NumberInput placeholder='Box' />
                    </div>;
                })
            },
            {
                accessorKey: 'pcs',
                header: 'Pcs',
                size: "auto",
                Cell: ((cell) => {
                    return <div>
                        <NumberInput placeholder='Pcs' />
                    </div>;
                })
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                size: "auto"
            }
        ],
        [],
    );

    return (<>
        <AppHeader />
        <Box p={5}>
            <Flex p={10} gap={10}>
                <Text fz={"lg"} fw={600}>ORDER</Text>
            </Flex>
            <MantineReactTable
                columns={columns}
                data={orderData}
                enableTopToolbar={false}
            />
        </Box>
    </>
    )
}

export default Order