import { Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconCirclePlus } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import { MantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react'

const Order = () => {
    const theme = useMantineTheme();
    const [orderModal, setOrderModal] = useState(false);
    const [orderData, setOrderData] = useState([]);

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
            order_id: "",
            item_code: "",
            box: "",
            pcs: "",
            amount: "",
        },
    });

    const addOrder = () => {
        orderForm.values.order_id = `ORD-${orderData.length + 1}`;
        orderForm.values.amount = (orderForm.values.box * 10) + (orderForm.values.pcs * 10)
        console.log(orderForm.values);
        setOrderData([...orderData, orderForm.values])
        setOrderModal(false)
    }

    return (<>
        <AppHeader />
        <Box p={5}>
            <Flex p={10} gap={10}>
                <Text fz={"lg"} fw={600}>ORDER</Text>
                <IconCirclePlus style={{ cursor: "pointer" }} onClick={() => { orderForm.reset(); setOrderModal(true); }} color={theme.colors.brand[8]} />
            </Flex>
            <MantineReactTable
                columns={columns}
                data={orderData}
                enableTopToolbar={false}
            />
        </Box>
        <Modal opened={orderModal} onClose={() => { setOrderModal(false) }} title="Add order">
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
                            <Button onClick={addOrder}>Save Order</Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Box>
        </Modal>
    </>
    )
}

export default Order