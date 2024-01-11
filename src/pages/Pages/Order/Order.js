import { ActionIcon, Box, Flex, Text, Tooltip, useMantineTheme } from '@mantine/core';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import SetOrder from './SetOrder';
import AppHeader from 'components/AppHeader';
import { IconCirclePlus, IconEdit, IconPlus, IconPrinter, IconTrash } from '@tabler/icons';
import { DatePickerInput } from '@mantine/dates';
import { MantineReactTable } from 'mantine-react-table';
import FloatingMenu from 'components/FloatingMenu';
import { openConfirmModal } from '@mantine/modals';
import { showSuccessToast } from 'utilities/Toast';
import { useReactToPrint } from 'react-to-print';
import { PrintModal } from 'components/PrintModal';

const confirm_delete_props = {
    title: "Please confirm delete order",
    children: (
        <Text size="sm">
            Are you sure you want to delete this order ? Everything related to this order will be
            deleted.
        </Text>
    ),
    labels: { confirm: "Delete Order", cancel: "Cancel" },
    onCancel: () => console.log("Cancel"),
    confirmProps: { color: "red" },
};

const Order = () => {
    const theme = useMantineTheme();
    const [isSetOrder, setIsSetOrder] = useState(false);
    const [orderDataInput, setOrderDataInput] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [orderIdNext, setOrderIdNext] = useState(1);
    const [editingData, setEditingData] = useState([]);
    const [printBodyData, setPrintBodyData] = useState([]);

    useEffect(() => {
        if (orderDataInput.length === 4) {
            let data = {
                id: orderIdNext,
                to_party: orderDataInput[2],
                bill_amount: orderDataInput[1][4],
                date: orderDataInput[3].toLocaleDateString(),
                order: orderDataInput,
            };
            setTableData(e => [...e, data]);
            setOrderIdNext(orderIdNext + 1);
        }

        console.log(orderDataInput);
    }, [orderDataInput])

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        if (printBodyData.length) {
            handlePrint();
        }
    }, [printBodyData])

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
                size: "auto",
                Cell: ({ cell }) => {
                    return <Box p={2} style={{ cursor: "pointer" }} onClick={() => {
                        let data = cell.row.original?.order?.length ? cell.row.original?.order[0]?.filter((e, i) => e.amount > 0) : [];
                        console.log(data);
                        if (data.length) {
                            let printData = [];
                            data.map((e, i) => {
                                let template = ["", 0, 0, 0, 0, 0];
                                template[0] = e.item_code;
                                template[1] = e.box === undefined ? 0 : e.box;
                                template[2] = e.pcs === undefined ? 0 : e.pcs;
                                template[5] = e.amount;
                                printData.push(template);
                            })
                            setPrintBodyData(printData);
                        }
                    }}>
                        <IconPrinter />
                    </Box>;
                },
            },
        ],
        [],
    );

    const openDeleteConfirmation = id => {
        openConfirmModal({
            ...confirm_delete_props,
            onConfirm: async () => await deleteOrder(id),
        });
    };

    const deleteOrder = async id => {
        const deleteIndex = tableData.findIndex((e, i) => e.id === id);
        let data = tableData;
        data.splice(deleteIndex, 1);
        setTableData(data);
        showSuccessToast({ title: "Deleted Order", message: "Deleted order successfully" });
    };

    const children = <></>;

    return (
        <div>
            {isSetOrder ? <>
                <AppHeader title="ADD ORDER" /><SetOrder setOrderDataInput={setOrderDataInput} editingData={editingData} setIsSetOrder={setIsSetOrder} /></> :
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
                            renderRowActions={({ row }) => (
                                <Flex>
                                    <Tooltip label="Edit Order">
                                        <ActionIcon
                                            ml={10}
                                            sx={theme => ({ color: theme.colors.brand[7] })}
                                            onClick={() => {
                                                console.log(row.original.order);
                                                setEditingData(row.original.order);
                                                setIsSetOrder(true);
                                            }}
                                        >
                                            <IconEdit style={{ width: 20 }} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Delete Order">
                                        <ActionIcon
                                            sx={theme => ({ color: theme.colors.red[6] })}
                                            ml={10}
                                            onClick={() => {
                                                openDeleteConfirmation(row.original.id);
                                            }}
                                        >
                                            <IconTrash style={{ width: 20 }} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Flex>
                            )}
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
            <div style={{ display: "none" }}>
                <PrintModal
                    title="Orders"
                    head={["Particulars", "Box", "Pcs", "Tax%", "Tax ₹", "Amount"]}
                    body={printBodyData}
                    ref={componentRef}
                    children={children}
                />
            </div>

        </div>
    )
}

export default Order