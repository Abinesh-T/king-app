import { ActionIcon, Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import { MantineReactTable } from 'mantine-react-table';
import React, { useEffect, useMemo, useState } from 'react'

const Order = () => {
    const theme = useMantineTheme();
    const [orderData, setOrderData] = useState([]);

    const [toParty, setToParty] = useState(null);
    const [footer, setFooter] = useState(["", "Total", "", "", ""]);
    const [render, setRender] = useState(false);
    const [rate, setRate] = useState({ box_rate: 20, pcs_rate: 5 });

    useEffect(() => {
        if (!orderData.length) {
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
                {
                    item_code: "item5",
                },
                {
                    item_code: "item6",
                },
                {
                    item_code: "item7",
                },
                {
                    item_code: "item8",
                },
            ]
            setOrderData(order);
        }
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
                            value={cell.row.original[cell.column.id]}
                            onChange={(e) => {
                                cell.row._valuesCache[cell.column.id] = e;
                                cell.row.original[cell.column.id] = e;
                            }}
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
                size: "auto",
                Footer: ({ table }) => {
                    return (
                        <>
                            <Text>{"Total"}</Text>
                        </>
                    )
                },
            },
            {
                accessorKey: 'box',
                header: 'Box',
                size: "auto",
                Cell: ((cell) => {
                    return <div>
                        <NumberInput
                            value={cell.row.original[cell.column.id]}
                            onChange={(e) => {
                                cell.row._valuesCache[cell.column.id] = e;
                                cell.row.original[cell.column.id] = e;
                                cell.row.original["amount"] = (rate.box_rate * e) + (rate.pcs_rate * (isNaN(cell.row.original["pcs"]) ? 0 : cell.row.original["pcs"]));
                                setRender(e => !e);
                            }}
                            min={0}
                            placeholder='Box' />
                    </div>;
                }),
                Footer: ({ table }) => {
                    let rows = table.getPaginationRowModel().rows;
                    let sum_box = 0;
                    rows.map((e, i) => {
                        if (!isNaN(e.original.box))
                            sum_box += e.original.box;
                    })

                    setFooter(e => {
                        e[2] = sum_box;
                        return e;
                    })
                    return (
                        <>
                            <Text>{sum_box}</Text>
                        </>
                    )
                },
            },
            {
                accessorKey: 'pcs',
                header: 'Pcs',
                size: "auto",
                Cell: ((cell) => {
                    return <div>
                        <NumberInput
                            value={cell.row.original[cell.column.id]}
                            onChange={(e) => {
                                cell.row._valuesCache[cell.column.id] = e;
                                cell.row.original[cell.column.id] = e;
                                cell.row.original["amount"] = (rate.box_rate * (isNaN(cell.row.original["box"]) ? 0 : cell.row.original["box"])) + (rate.pcs_rate * e);
                                setRender(e => !e);
                            }}
                            min={0}
                            placeholder='Pcs' />
                    </div>;
                }),
                Footer: ({ table }) => {
                    let rows = table.getPaginationRowModel().rows;
                    let sum_pcs = 0;
                    rows.map((e, i) => {
                        if (!isNaN(e.original.pcs))
                            sum_pcs += e.original.pcs;
                    })

                    setFooter(e => {
                        e[3] = sum_pcs;
                        return e;
                    })
                    return (
                        <>
                            <Text>{sum_pcs}</Text>
                        </>
                    )
                },
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                size: "auto",
                Cell: ((cell) => {
                    let amount = cell.row.original[cell.column.id];
                    cell.row.original[cell.column.id] = isNaN(amount) ? 0 : amount;
                    return <div>
                        <Text>{cell.row.original[cell.column.id]}</Text>
                    </div>;
                }),
                Footer: ({ table }) => {
                    let rows = table.getPaginationRowModel().rows;
                    let sum_amount = 0;
                    rows.map((e, i) => {
                        if (!isNaN(e.original.amount))
                            sum_amount += e.original.amount;
                    })

                    setFooter(e => {
                        e[4] = sum_amount;
                        return e;
                    })
                    return (
                        <>
                            <Text>{sum_amount}</Text>
                        </>
                    )
                },
            }
        ],
        [],
    );

    const head = ['supplier_party', 'item_code', 'box', 'pcs', 'amount'];
    console.log(footer);

    const body = orderData.map((e, i) => {
        let row = [];
        head.map((k, index) => {
            row.push(e[k] ? e[k] : 0);
        })
        return row;
    })

    return (<>
        <AppHeader />
        <Box p={5}>
            <Flex p={10} pb={0}>
                <Text fz={"lg"} fw={600}>ORDER</Text>
            </Flex>
            <Flex p={10} mb={10} gap={10} justify={"space-between"} align={"flex-end"}>
                <Select
                    value={toParty}
                    onChange={setToParty}
                    label="To Party"
                    placeholder="Select To Party"
                    data={[
                        { value: 'Party 1', label: 'Party 1' },
                        { value: 'Party 2', label: 'Party 2' },
                        { value: 'Party 3', label: 'Party 3' },
                    ]}
                />
                <Button>Save Order</Button>
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