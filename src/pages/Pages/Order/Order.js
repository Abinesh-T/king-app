import { ActionIcon, Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { IconCirclePlus, IconEdit, IconTrash } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import { MantineReactTable } from 'mantine-react-table';
import React, { useEffect, useMemo, useState } from 'react'

const confirm_delete_props = {
    title: "Please confirm delete order",
    children: (
        <Text size="sm">
            Are you sure you want to delete this order ? Everything related to this order will be deleted.
        </Text>
    ),
    labels: { confirm: "Delete Order", cancel: "Cancel" },
    onCancel: () => console.log("Cancel"),
    confirmProps: { color: "red" },
};

const Order = () => {
    const theme = useMantineTheme();
    const [orderModal, setOrderModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [orderData, setOrderData] = useState([]);
    const [nextId, setNextId] = useState(1);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'order_id',
                header: 'Order Id',
                size: "auto"
            },
            {
                accessorKey: 'item_code',
                header: 'Item Code',
                size: "auto"
            },
            {
                accessorKey: 'box',
                header: 'Box',
                size: "auto"
            },
            {
                accessorKey: 'pcs',
                header: 'Pcs',
                size: "auto"
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                size: "auto"
            }
        ],
        [],
    );

    const orderForm = useForm({
        validateInputOnBlur: true,
        shouldUnregister: false,
        initialValues: {
            id: "",
            order_id: "",
            item_code: "",
            box: "",
            pcs: "",
            amount: "",
        },
    });

    const addOrder = () => {
        orderForm.values.id = nextId;
        setNextId(e => e + 1);
        orderForm.values.order_id = `ORD-${orderData.length + 1}`;
        orderForm.values.amount = (orderForm.values.box * 10) + (orderForm.values.pcs * 10)
        console.log(orderForm.values);
        setOrderData([...orderData, orderForm.values])
        setOrderModal(false)
    }

    const deleteOrder = async id => {
        console.log("Deleted", id);
    }

    const openDeleteConfirmation = id => {
        openConfirmModal({
            ...confirm_delete_props,
            onConfirm: async () => await deleteOrder(id),
        });
    };

    const editOrder = (values) => {
        console.log(values);
        orderForm.setValues(values);
        setIsEditing(true)
        setOrderModal(true);
    }

    return (<>
        <AppHeader />
        <Box p={5}>
            <Flex p={10} gap={10}>
                <Text fz={"lg"} fw={600}>ORDER</Text>
                <IconCirclePlus style={{ cursor: "pointer" }} onClick={() => { orderForm.reset(); setIsEditing(false); setOrderModal(true); }} color={theme.colors.brand[8]} />
            </Flex>
            <MantineReactTable
                enableRowActions
                positionActionsColumn="last"
                renderRowActions={({ row }) => (
                    <Flex>
                        <Tooltip label="Edit Party">
                            <ActionIcon
                                sx={theme => ({ color: theme.colors.brand[7] })}
                                ml={10}
                                onClick={() => {
                                    editOrder(row.original)
                                }}
                            >
                                <IconEdit style={{ width: 20 }} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete Party">
                            <ActionIcon
                                sx={theme => ({ color: theme.colors.red[6] })}
                                ml={10}
                                onClick={() => {
                                    openDeleteConfirmation(row.original.id)
                                }}
                            >
                                <IconTrash style={{ width: 20 }} />
                            </ActionIcon>
                        </Tooltip>
                    </Flex>
                )}
                columns={columns}
                data={orderData}
                enableTopToolbar={false}
            />
        </Box>
        <Modal opened={orderModal} onClose={() => { orderForm.reset(); setOrderModal(false) }} title={isEditing ? "Edit order" : "Add order"}>
            <Box p={5}>
                <Grid>
                    <Grid.Col>
                        <Select
                            label="Select Item"
                            placeholder="Select Item"
                            data={[
                                { value: 'IT1', label: 'Item 1' },
                                { value: 'IT2', label: 'Item 2' },
                                { value: 'IT3', label: 'Item 3' },
                            ]}
                            {...orderForm.getInputProps("item_code")} />
                    </Grid.Col>
                    <Grid.Col>
                        <NumberInput label="Box" placeholder='Enter Box' {...orderForm.getInputProps("box")} />
                    </Grid.Col>
                    <Grid.Col>
                        <NumberInput label="Pcs" placeholder='Enter Pcs' {...orderForm.getInputProps("pcs")} />
                    </Grid.Col>
                    <Grid.Col>
                        <Flex align={"center"} justify={"right"}>
                            <Button onClick={isEditing ? editOrder : addOrder}>{isEditing ? "Edit Order" : "Save Order"}</Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Box>
        </Modal>
    </>
    )
}

export default Order