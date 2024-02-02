import { ActionIcon, Box, Button, Col, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { IconCirclePlus, IconCoinOff, IconDeviceFloppy, IconPrinter, IconReceiptTax, IconX } from '@tabler/icons';
import { MantineReactTable } from 'mantine-react-table';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query';
import { api_all_item } from '../Item/item.service';
import { showErrorToast, showSuccessToast } from 'utilities/Toast';
import { api_add_billing, api_add_order, api_billing_parties, api_edit_billing, api_edit_order } from './billing.service';
import { api_all_rate } from '../Settings/rate.service';
import FloatingMenu from 'components/FloatingMenu';
import { getAlteredSelectionParty } from 'services/helperFunctions';

const SetBilling = (props) => {
    const theme = useMantineTheme();

    const [billingData, setBillingData] = useState([]);
    const [errorParty, setErrorParty] = useState(null);
    const [toParty, setToParty] = useState(null);
    const [footer, setFooter] = useState(["", "Total", "", "", "", ""]);
    const [date, setDate] = useState(new Date());
    const [itemData, setItemData] = useState([]);
    const [render, setRender] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [rate, setRate] = useState({ rate: 0, qty: 0 });
    const [modalData, setModalData] = useState({
        balance: 0.00,
        commission_percent: 0.00,
        commission: 0.00,
        rent: 0.00,
        wages: 0.00,
        total: 0.00,
    });

    const fetch_item = useQuery("fetch_item", api_all_item, {
        refetchOnWindowFocus: false,
        onSuccess: res => {
            setItemData(res.data);
            let order = [];
            res.data?.map((e, i) => {
                order.push({
                    code: e.code,
                    item_id: e.id,
                });
            })
            if (props.editingData !== null) {
                setToParty(props.editingData?.reciever);
                setDate(new Date(props.editingData?.date + ", 00:00:00 AM"));
                let data = structuredClone(modalData);
                data["balance"] = props.editingData?.balance;
                data["commission_percent"] = props.editingData?.commission_percent;
                data["commission"] = props.editingData?.commission;
                data["rent"] = props.editingData?.rent;
                data["wages"] = props.editingData?.wages;
                data["total"] = props.editingData?.total;
                setModalData(data);

                console.log(props.editingData, order);

                props.editingData?.invoice_items?.map((e, i) => {
                    order.map((v, i) => {
                        if (v.item_id === e.item) {
                            v["amount"] = e.amount;
                            v["qty"] = e.qty;
                            v["rate"] = e.rate;
                            v["pcs"] = e.pcs;
                            v["supplier_party"] = e.supplier;
                            v["id"] = e.id;
                        }
                    })
                })

                setBillingData(order);
            } else {
                setBillingData(order);
            }
        },
    });

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
                            data={props.partyData.filter((e, i) => e.type === "supplier")}
                        />
                    </div>;
                },
            },
            {
                accessorKey: 'code',
                header: 'Item',
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
                accessorKey: 'rate',
                header: 'Rate',
                size: 50,
                Cell: ((cell) => {
                    return <div>
                        <NumberInput
                            miw={"40px"}
                            value={cell.row.original[cell.column.id]}
                            onChange={(e) => {
                                cell.row._valuesCache[cell.column.id] = e;
                                cell.row.original[cell.column.id] = e;
                                cell.row.original["amount"] = (e) * (isNaN(cell.row.original["qty"]) ? 0 : cell.row.original["qty"]);
                                setRender(e => !e);
                            }}
                            min={0}
                            hideControls
                            placeholder='Rate' />
                    </div>;
                }),
                Footer: ({ table }) => {
                    let rows = table.getPaginationRowModel().rows;
                    let sum_rate = 0;
                    rows.map((e, i) => {
                        if (!isNaN(e.original.rate))
                            sum_rate += e.original.rate;
                    })
                    let f = footer;
                    f[3] = sum_rate;
                    setFooter(f);
                    return (
                        <>
                            <Text>{sum_rate}</Text>
                        </>
                    )
                },
            },
            {
                accessorKey: 'qty',
                header: 'Qty',
                size: 50,
                Cell: ((cell) => {
                    return <div>
                        <NumberInput
                            miw={"40px"}
                            value={cell.row.original[cell.column.id]}
                            onChange={(e) => {
                                cell.row._valuesCache[cell.column.id] = e;
                                cell.row.original[cell.column.id] = e;
                                cell.row.original["amount"] = (e) * (isNaN(cell.row.original["rate"]) ? 0 : cell.row.original["rate"]);
                                setRender(e => !e);
                            }}
                            min={0}
                            hideControls
                            placeholder='Qty' />
                    </div>;
                }),
                Footer: ({ table }) => {
                    let rows = table.getPaginationRowModel().rows;
                    let sum_qty = 0;
                    rows.map((e, i) => {
                        if (!isNaN(e.original.qty))
                            sum_qty += e.original.qty;
                    })
                    let f = footer;
                    f[4] = sum_qty;
                    setFooter(f);
                    return (
                        <>
                            <Text>{sum_qty}</Text>
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
                    f[5] = sum_amount;
                    setFooter(f);
                    setModalData(e => { e.balance = sum_amount; return e });
                    // setTableData(rows);
                    // setIsSelected(false);
                    return (
                        <>
                            <Text>{sum_amount}</Text>
                        </>
                    )
                },
            },
        ],
        [],
    );

    const handleTotal = () => {
        if (modalData.commission_percent > 0) {
            modalData.commission = (modalData.commission_percent / 100) * modalData.balance;
        }
        const total = modalData.balance - modalData.commission - modalData.rent - modalData.wages;
        setModalData(e => { e.total = total; return e });
        setRender(e => !e);
    }

    useEffect(() => {
        handleTotal();
    }, [modalData])

    const addItem = async (billingData, footer, toParty, date) => {
        // console.log(billingData, footer, toParty, date);
        let billing_items = billingData?.filter((e, i) => (e.amount > 0) && (e.supplier_party));
        // console.log(billing_items);

        let invoice_item = [];
        if (props.editingData !== null) {
            billing_items.map((e, i) => {
                let item_obj = {
                    supplier_id: e.supplier_party,
                    rate: e.rate,
                    qty: e.qty,
                    amount: e.amount,
                }
                if (e.id !== undefined) {
                    item_obj["id"] = e.id;
                } else {
                    item_obj["item_id"] = e.item_id;
                }
                invoice_item.push(item_obj);
            })
        } else {
            billing_items.map((e, i) => {
                invoice_item.push({
                    item_id: e.item_id,
                    supplier_id: e.supplier_party,
                    rate: e.rate,
                    qty: e.qty,
                    amount: e.amount,
                });
            })
        }

        const payload = {
            invoice: {
                reciever_id: toParty,
                date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                rate: footer[3],
                qty: footer[4],
                amount: footer[5],
                ...modalData,
            },
            invoice_item: invoice_item,
        }

        if (props.editingData !== null) {
            payload.invoice['id'] = props.editingData?.id;
        }

        console.log(payload);

        if (props.editingData !== null) {
            await api_edit_billing(payload).then(
                res => {
                    if (res.success) {
                        console.log(res);
                        props.setFetchDate(date);
                        props.setEditingData(null);
                        showSuccessToast({ title: "Success", message: res.message });
                        props.setIsSetBilling(false);
                    } else {
                        showErrorToast({ title: "Error", message: res.message });
                    }
                }
            ).catch(err => {
                console.log(err);
            })

        } else {
            await api_add_billing(payload).then(
                res => {
                    if (res.success) {
                        console.log(res);
                        props.setFetchDate(date);
                        props.setEditingData(null);
                        showSuccessToast({ title: "Success", message: res.message });
                        props.setIsSetBilling(false);
                    } else {
                        showErrorToast({ title: "Error", message: res.message });
                    }
                }
            ).catch(err => {
                console.log(err);
            })
        }
    }

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
                            let billing_items = billingData?.filter((e, i) => (e.amount > 0) && (e.supplier_party));

                            if (toParty !== null && billing_items.length) {
                                addItem(billingData, footer, toParty, date);
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
                            props.setIsSetBilling(false);
                        }}>CANCEL</Button>
                    </Flex>
                </Grid.Col>
            </Grid>
            <MantineReactTable
                columns={columns}
                data={billingData}
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

            <FloatingMenu
                m={5}
                left
                size={50}
                onClick={() => {
                    handleTotal();
                    setShowModal(true);
                }}
            >
                <IconReceiptTax color="white" />
            </FloatingMenu>

            <Modal
                opened={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
            >
                <Box p={5}>
                    <Grid>
                        <Col span={6}>
                            <Text>Balance</Text>
                        </Col>
                        <Col span={6}>
                            <NumberInput
                                variant='unstyled'
                                hideControls
                                disabled
                                value={modalData.balance}
                                onChange={(e) => {
                                    let data = structuredClone(modalData);
                                    data.balance = e;
                                    setModalData(data);
                                }}
                            />
                        </Col>
                        <Col span={6}>
                            <Text>Commission (%)</Text>
                        </Col>
                        <Col span={3}>
                            <NumberInput
                                hideControls
                                value={modalData.commission_percent}
                                onChange={(e) => {
                                    let data = structuredClone(modalData);
                                    data.commission_percent = e;
                                    setModalData(data);
                                }}
                            />
                        </Col>
                        <Col span={3}>
                            <NumberInput
                                variant='unstyled'
                                hideControls
                                disabled
                                value={modalData.commission}
                                onChange={(e) => {
                                    let data = structuredClone(modalData);
                                    data.commission = e;
                                    setModalData(data);
                                }}
                            />
                        </Col>
                        <Col span={6}>
                            <Text>Rent</Text>
                        </Col>
                        <Col span={6}>
                            <NumberInput
                                hideControls
                                value={modalData.rent}
                                onChange={(e) => {
                                    let data = structuredClone(modalData);
                                    data.rent = e;
                                    setModalData(data);
                                }}
                            />
                        </Col>
                        <Col span={6}>
                            <Text>Wages</Text>
                        </Col>
                        <Col span={6}>
                            <NumberInput
                                hideControls
                                value={modalData.wages}
                                onChange={(e) => {
                                    let data = structuredClone(modalData);
                                    data.wages = e;
                                    setModalData(data);
                                }}
                            />
                        </Col>
                        <Col span={6}>
                            <Text>Total</Text>
                        </Col>
                        <Col span={6}>
                            <NumberInput
                                variant='unstyled'
                                hideControls
                                disabled
                                value={modalData.total}
                            // onChange={(e) => {
                            //     let data = structuredClone(modalData);
                            //     data.total = e;
                            //     setModalData(data);
                            // }}
                            />
                        </Col>
                        {/* <Col span={12}>
                            <Button w={"100%"}>Save</Button>
                        </Col> */}
                    </Grid>
                </Box>
            </Modal>
        </Box>
    </>
    )
}

export default SetBilling