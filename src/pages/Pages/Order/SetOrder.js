import { ActionIcon, Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { IconCirclePlus, IconDeviceFloppy, IconPrinter, IconX } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import { PrintModal } from 'components/PrintModal';
import { MantineReactTable } from 'mantine-react-table';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';

const SetOrder = (props) => {
    const theme = useMantineTheme();
    const [head, setHead] = useState(['supplier_party', 'item_code', 'box', 'pcs', 'amount']);

    const [orderData, setOrderData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [tableSelectedData, setTableSelectedData] = useState([]);
    const [isSelected, setIsSelected] = useState(false);


    const [toParty, setToParty] = useState(null);
    const [footer, setFooter] = useState(["", "Total", "", "", ""]);
    const [footerSelected, setFooterSelected] = useState(["", "Total", 0, 0, 0]);
    const [render, setRender] = useState(false);
    const [rate, setRate] = useState({ box_rate: 20, pcs_rate: 5 });
    const [date, setDate] = useState(new Date());

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
                                setRender(e => !e);
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
                    let f = footer;
                    f[2] = sum_box;
                    setFooter(f);
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
                    let f = footer;
                    f[3] = sum_pcs;
                    setFooter(f);
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
                    let f = footer;
                    f[4] = sum_amount;
                    setFooter(f);
                    setTableData(rows);
                    setIsSelected(false);
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

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        if (isSelected) {
            handlePrint();
        }
    }, [isSelected])


    return (<>
        <Box p={5}>
            <Flex p={10} pb={0} justify={"space-between"}>
                <Text fz={"lg"} fw={600}>ADD ORDER</Text>

                <Flex gap={10} justify={"right"} align={"flex-end"}>
                    <Button size='xs' leftIcon={<IconDeviceFloppy />} onClick={() => {
                        props.setOrderDataInput([[orderData, toParty, date]]);
                        props.setIsSetOrder(false);
                    }}>SAVE</Button>
                    <Button size='xs' variant="outline" leftIcon={<IconX />} onClick={() => {
                        props.setOrderDataInput([[]]);
                        props.setIsSetOrder(false);
                    }}>CANCEL</Button>
                    {/* <Button
                    rightIcon={<IconPrinter />}
                    onClick={() => {
                        handlePrint();
                    }}>Save Order</Button> */}
                </Flex>
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
                <DatePickerInput miw={110} label="Select Date" value={date} onChange={setDate} />
            </Flex>
            <MantineReactTable
                columns={columns}
                data={orderData}
            // enableRowSelection
            // renderTopToolbarCustomActions={({ table }) => (
            //     <Button
            //         variant='outline'
            //         rightIcon={<IconPrinter />}
            //         onClick={() => {
            //             const rowSelection = table.getState().rowSelection; //read state
            //             const selectedRows = table.getSelectedRowModel().rows; //or read entire rows

            //             let sum_amount = 0;
            //             let sum_box = 0;
            //             let sum_pcs = 0;
            //             selectedRows.map((e, i) => {
            //                 if (!isNaN(e.original.box))
            //                     sum_box += e.original.box;
            //                 if (!isNaN(e.original.pcs))
            //                     sum_pcs += e.original.pcs;
            //                 if (!isNaN(e.original.amount))
            //                     sum_amount += e.original.amount;
            //             })
            //             let f = footerSelected;
            //             f[2] = sum_box;
            //             f[3] = sum_pcs;
            //             f[4] = sum_amount;
            //             setFooterSelected(f);
            //             setTableSelectedData(selectedRows);
            //             setIsSelected(true);
            //         }}
            //     >
            //         Selected Orders
            //     </Button>
            // )}
            />
        </Box>
        <div style={{ display: "none" }}>
            <PrintModal
                title="Orders"
                head={head}
                body={isSelected ?
                    [...tableSelectedData.map((e, i) => {
                        let row = [];
                        head.map((k, index) => {
                            row.push(e.original[k] ? e.original[k] : 0);
                        })
                        return row;
                    }), footerSelected] :
                    [...tableData.map((e, i) => {
                        let row = [];
                        head.map((k, index) => {
                            row.push(e.original[k] ? e.original[k] : 0);
                        })
                        return row;
                    }), footer]}
                ref={componentRef}
            />
        </div>
    </>
    )
}

export default SetOrder