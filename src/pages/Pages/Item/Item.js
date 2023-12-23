import { Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconCirclePlus } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import { MantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react'

const Item = () => {
    const theme = useMantineTheme();
    const [itemModal, setItemModal] = useState(false);
    const [itemData, setItemData] = useState([]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'item_code',
                header: 'Item Code',
                size: "auto"
            },
            {
                accessorKey: 'item_name',
                header: 'Item Name',
                size: "auto"
            },
            {
                accessorKey: 'box_rate',
                header: 'Box Rate',
                size: "auto"
            },
            {
                accessorKey: 'pcs_rate',
                header: 'Pcs Rate',
                size: "auto"
            }
        ],
        [],
    );

    const itemForm = useForm({
        validateInputOnBlur: true,
        shouldUnregister: false,
        initialValues: {
            item_code: "",
            item_name: "",
            box_rate: "",
            pcs_rate: "",
        },
    });

    const addItem = () => {
        console.log(itemForm.values);
        setItemData([...itemData, itemForm.values])
        setItemModal(false)
    }

    return (<>
        <AppHeader />
        <Box p={5}>
            <Flex p={10} gap={10}>
                <Text fz={"lg"} fw={600}>ITEM</Text>
                <IconCirclePlus style={{ cursor: "pointer" }} onClick={() => { setItemModal(true) }} color={theme.colors.brand[8]} />
            </Flex>
            <MantineReactTable
                columns={columns}
                data={itemData}
                enableTopToolbar={false}
            />
        </Box>
        <Modal opened={itemModal} onClose={() => { setItemModal(false) }} title="Add Item">
            <Box p={5}>
                <Grid>
                    <Grid.Col>
                        <TextInput label="Item Code" placeholder='Enter Item Code' {...itemForm.getInputProps("item_code")} />
                    </Grid.Col>
                    <Grid.Col>
                        <TextInput label="Item Name" placeholder='Enter Item Name' {...itemForm.getInputProps("item_name")} />
                    </Grid.Col>
                    <Grid.Col>
                        <NumberInput label="Box Rate" placeholder='Enter Box Rate' {...itemForm.getInputProps("box_rate")} />
                    </Grid.Col>
                    <Grid.Col>
                        <NumberInput label="Pcs Rate" placeholder='Enter Pcs Rate' {...itemForm.getInputProps("pcs_rate")} />
                    </Grid.Col>
                    <Grid.Col>
                        <Flex align={"center"} justify={"right"}>
                            <Button onClick={addItem}>Save Item</Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Box>
        </Modal>
    </>
    )
}

export default Item