import { ActionIcon, Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { IconCirclePlus, IconEdit, IconPlus, IconTrash } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import FloatingMenu from 'components/FloatingMenu';
import { MantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react'

const confirm_delete_props = {
    title: "Please confirm delete item",
    children: (
        <Text size="sm">
            Are you sure you want to delete this item ? Everything related to this item will be deleted.
        </Text>
    ),
    labels: { confirm: "Delete Item", cancel: "Cancel" },
    onCancel: () => console.log("Cancel"),
    confirmProps: { color: "red" },
};

const Item = () => {
    const theme = useMantineTheme();
    const [itemModal, setItemModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [itemData, setItemData] = useState([]);
    const [nextId, setNextId] = useState(1);

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
        ],
        [],
    );

    const itemForm = useForm({
        validateInputOnBlur: true,
        shouldUnregister: false,
        initialValues: {
            id: "",
            item_code: "",
            item_name: "",
        },
    });

    const addItem = () => {
        itemForm.values.id = nextId;
        setNextId(e => e + 1);
        setItemData([...itemData, itemForm.values])
        setItemModal(false)
    }

    const deleteItem = async id => {
        //console.log("Deleted", id);
    }

    const openDeleteConfirmation = id => {
        openConfirmModal({
            ...confirm_delete_props,
            onConfirm: async () => await deleteItem(id),
        });
    };

    const editItem = (values) => {
        itemForm.setValues(values);
        setIsEditing(true)
        setItemModal(true);
    }

    return (<>
        <AppHeader title="ITEM" />
        <Box p={5}>
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
                                    editItem(row.original);
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
                data={itemData}
                enableTopToolbar={false}
            />
        </Box>
        <FloatingMenu
            m={5}
            right
            size={50}
            onClick={() => {
                itemForm.reset(); setItemModal(true);
            }}
        >
            <IconPlus color="white" />
        </FloatingMenu>
        <Modal opened={itemModal} onClose={() => { itemForm.reset(); setIsEditing(false); setItemModal(false) }} title={isEditing ? "Edit Item" : "Add Item"}>
            <Box p={5}>
                <Grid>
                    <Grid.Col>
                        <TextInput label="Item Code" placeholder='Enter Item Code' {...itemForm.getInputProps("item_code")} />
                    </Grid.Col>
                    <Grid.Col>
                        <TextInput label="Item Name" placeholder='Enter Item Name' {...itemForm.getInputProps("item_name")} />
                    </Grid.Col>
                    <Grid.Col>
                        <Flex align={"center"} justify={"right"}>
                            <Button onClick={isEditing ? editItem : addItem}>{isEditing ? "Edit Item" : "Save Item"}</Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Box>
        </Modal>
    </>
    )
}

export default Item