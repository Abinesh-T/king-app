import { ActionIcon, Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { IconCirclePlus, IconDeviceFloppy, IconPrinter, IconX } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import { PrintModal } from 'components/PrintModal';
import { MantineReactTable } from 'mantine-react-table';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query';
import { useReactToPrint } from 'react-to-print';
import { api_all_item } from '../Item/item.service';
import { api_all_party } from '../Party/party.service';
import { getAlteredSelectionParty } from 'services/helperFunctions';
import { showErrorToast } from 'utilities/Toast';

const SetOrder = (props) => {
    const theme = useMantineTheme();
    const [head, setHead] = useState(['supplier_party', 'code', 'box', 'pcs', 'amount']);

    const [orderData, setOrderData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [tableSelectedData, setTableSelectedData] = useState([]);
    const [isSelected, setIsSelected] = useState(false);
    const [itemData, setItemData] = useState([]);

    const [toParty, setToParty] = useState(null);
    const [footer, setFooter] = useState(["", "Total", "", "", ""]);
    const [footerSelected, setFooterSelected] = useState(["", "Total", 0, 0, 0]);
    const [render, setRender] = useState(false);
    const [rate, setRate] = useState({ box_rate: 20, pcs_rate: 5 });
    const [date, setDate] = useState(new Date());

    const fetch_item = useQuery("fetch_item", api_all_item, {
        refetchOnWindowFocus: false,
        onSuccess: res => {
            setItemData(res.data);
            let order = [];
            res.data?.map((e, i) => {
                order.push({
                    code: e.code,
                });
            })
            setOrderData(order);
        },
    });

    useEffect(() => {
        if (props.editingData?.length) {
            setOrderData(props.editingData[0]);
            setToParty(props.editingData[2]);
            setDate(props.editingData[3]);
        }
        //  else {
        //     if (!orderData.length) {
        //         let order = [];
        //         itemData?.map((e, i) => {
        //             order.push({
        //                 code: e.code,
        //             });
        //         })
        //         setOrderData(order);
        //     }
        // }
    }, [])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'supplier_party',
                header: 'Supplier Party',
                size: 70,
                Cell: ({ cell }) => {
                    return <div>
                        <Select
                            searchable
                            dropdownPosition="bottom"
                            value={cell.row.original[cell.column.id]}
                            onChange={(e) => {
                                cell.row._valuesCache[cell.column.id] = e;
                                cell.row.original[cell.column.id] = e;
                                setRender(e => !e);
                            }}
                            placeholder="Select Party"
                            data={props.partyData}
                        />
                    </div>;
                },
            },
            {
                accessorKey: 'code',
                header: 'Item Code',
                size: 70,
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
                size: 50,
                Cell: ((cell) => {
                    return <div>
                        <NumberInput
                            miw={"40px"}
                            value={cell.row.original[cell.column.id]}
                            onChange={(e) => {
                                cell.row._valuesCache[cell.column.id] = e;
                                cell.row.original[cell.column.id] = e;
                                cell.row.original["amount"] = (rate.box_rate * e) + (rate.pcs_rate * (isNaN(cell.row.original["pcs"]) ? 0 : cell.row.original["pcs"]));
                                setRender(e => !e);
                            }}
                            min={0}
                            hideControls
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
                size: 50,
                Cell: ((cell) => {
                    return <div>
                        <NumberInput
                            miw={"40px"}
                            value={cell.row.original[cell.column.id]}
                            onChange={(e) => {
                                cell.row._valuesCache[cell.column.id] = e;
                                cell.row.original[cell.column.id] = e;
                                cell.row.original["amount"] = (rate.box_rate * (isNaN(cell.row.original["box"]) ? 0 : cell.row.original["box"])) + (rate.pcs_rate * e);
                                setRender(e => !e);
                            }}
                            hideControls
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
                size: 50,
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
        <Box p={5} style={{ overflow: "hidden" }}>
            <Grid mb={5}>
                <Grid.Col span={6}>
                    <Select
                        value={toParty}
                        onChange={setToParty}
                        label="To Party"
                        placeholder="Select To Party"
                        searchable
                        data={props.partyData}
                    />
                    <DatePickerInput miw={110} label="Select Date" value={date} onChange={setDate} />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Flex h={"100%"} direction={"column"} align={"center"} justify={"space-evenly"}>
                        <Button w={100} size='xs' leftIcon={<IconDeviceFloppy />} onClick={() => {
                            props.setOrderDataInput([orderData, footer, toParty, date]);
                            props.setIsSetOrder(false);
                        }}>SAVE</Button>
                        <Button w={100} size='xs' variant="outline" leftIcon={<IconX />} onClick={() => {
                            props.setOrderDataInput([]);
                            props.setIsSetOrder(false);
                        }}>CANCEL</Button>
                        {/* <Button
                    rightIcon={<IconPrinter />}
                    onClick={() => {
                        handlePrint();
                    }}>Save Order</Button> */}
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
                enableStickyFooter
                enableStickyHeader
                mantineTableContainerProps={{ sx: { maxHeight: '65vh' } }}
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
                        }, '& th:nth-of-type(even)': {
                            padding: 0,
                            paddingLeft: 1,
                            paddingTop: 5,
                            paddingBottom: 5,
                        },
                    },
                }}
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