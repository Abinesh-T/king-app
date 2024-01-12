import { ActionIcon, Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { IconCirclePlus, IconEdit, IconPlus, IconTrash } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import FloatingMenu from 'components/FloatingMenu';
import { MantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react'
import { api_add_item, api_all_item, api_delete_item, api_edit_item } from './item.service';
import { useQuery } from 'react-query';
import { showErrorToast, showSuccessToast } from 'utilities/Toast';

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

    const fetch_item = useQuery("fetch_item", api_all_item, {
        refetchOnWindowFocus: false,
        onSuccess: res => {
            setItemData(res.data);
        },
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'code',
                header: 'Item Code',
                size: "auto"
            },
            {
                accessorKey: 'name',
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
            code: "",
            name: "",
        },
    });

    const addItem = async () => {
        const payload = {
            name: itemForm.values.name,
            code: itemForm.values.code,
        }

        await api_add_item(payload).then(
            res => {
                if (res.success) {
                    fetch_item.refetch();
                    console.log(res);
                    setItemModal(false);
                    showSuccessToast({ title: "Success", message: res.message });
                } else {
                    showErrorToast({ title: "Error", message: res.message });
                }
            }
        ).catch(err => {
            console.log(err);
        })
    }

    const deleteItem = async id => {
        await api_delete_item(id).then(
            res => {
                if (res.success) {
                    fetch_item.refetch();
                    console.log(res);
                    showSuccessToast({ title: "Success", message: res.message });
                } else {
                    showErrorToast({ title: "Error", message: res.message });
                }
            }
        ).catch(err => {
            console.log(err);
        })
    }

    const openDeleteConfirmation = id => {
        openConfirmModal({
            ...confirm_delete_props,
            onConfirm: async () => await deleteItem(id),
        });
    };

    const editItem = async () => {
        const payload = {
            id: itemForm.values.id,
            name: itemForm.values.name,
            code: itemForm.values.code,
        }

        await api_edit_item(payload).then(
            res => {
                if (res.success) {
                    fetch_item.refetch();
                    console.log(res);
                    setItemModal(false);
                    showSuccessToast({ title: "Success", message: res.message });
                } else {
                    showErrorToast({ title: "Error", message: res.message });
                }
            }
        ).catch(err => {
            console.log(err);
        })
    }

    return (<>
        <AppHeader title="ITEM" />
        <Box p={5}>
            <MantineReactTable
                enableRowActions
                positionActionsColumn="last"
                renderRowActions={({ row }) => (
                    <Flex>
                        <Tooltip label="Edit Item">
                            <ActionIcon
                                sx={theme => ({ color: theme.colors.brand[7] })}
                                ml={10}
                                onClick={() => {
                                    itemForm.setValues(row.original);
                                    setIsEditing(true)
                                    setItemModal(true);
                                }}
                            >
                                <IconEdit style={{ width: 20 }} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete Item">
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
                        <TextInput label="Item Code" placeholder='Enter Item Code' {...itemForm.getInputProps("code")} />
                    </Grid.Col>
                    <Grid.Col>
                        <TextInput label="Item Name" placeholder='Enter Item Name' {...itemForm.getInputProps("name")} />
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