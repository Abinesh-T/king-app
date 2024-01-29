import { ActionIcon, Box, Button, Flex, Grid, Modal, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { IconCirclePlus, IconEdit, IconPlus, IconTrash } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import FloatingMenu from 'components/FloatingMenu';
import { MantineReactTable } from 'mantine-react-table';
import React, { useEffect, useMemo, useState } from 'react'
import { api_add_party, api_all_party, api_delete_party, api_edit_party } from './party.service';
import { showErrorToast, showSuccessToast } from 'utilities/Toast';
import { useQuery } from 'react-query';

const confirm_delete_props = {
    title: "Please confirm delete party",
    children: (
        <Text size="sm">
            Are you sure you want to delete this party ? Everything related to this party will be deleted.
        </Text>
    ),
    labels: { confirm: "Delete Party", cancel: "Cancel" },
    onCancel: () => console.log("Cancel"),
    confirmProps: { color: "red" },
};

const Party = () => {
    const theme = useMantineTheme();
    const [partyModal, setPartyModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [partyData, setPartyData] = useState([]);

    const fetch_party = useQuery("fetch_party", api_all_party, {
        refetchOnWindowFocus: false,
        onSuccess: res => {
            setPartyData(res.data);
        },
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: "auto"
            },
            {
                accessorKey: 'party_type',
                header: 'Type',
                size: "auto"
            },
        ],
        [],
    );

    const partyForm = useForm({
        validateInputOnBlur: true,
        shouldUnregister: false,
        initialValues: {
            id: "",
            name: "",
            party_type: "",
        },
    });

    const addParty = async () => {
        const payload = {
            name: partyForm.values.name,
            party_type: partyForm.values.party_type,
        }

        await api_add_party(payload).then(
            res => {
                if (res.success) {
                    fetch_party.refetch();
                    console.log(res);
                    setPartyModal(false);
                    showSuccessToast({ title: "Success", message: res.message });
                } else {
                    showErrorToast({ title: "Error", message: res.message });
                }
            }
        ).catch(err => {
            console.log(err);
        })
    }

    const deleteParty = async id => {
        await api_delete_party(id).then(
            res => {
                if (res.success) {
                    fetch_party.refetch();
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
            onConfirm: async () => await deleteParty(id),
        });
    };

    const editParty = async () => {
        const payload = {
            id: partyForm.values.id,
            name: partyForm.values.name,
            party_type: partyForm.values.party_type.toLowerCase(),
        }

        await api_edit_party(payload).then(
            res => {
                if (res.success) {
                    fetch_party.refetch();
                    console.log(res);
                    setPartyModal(false);
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
        <AppHeader title="PARTY" />
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
                                    partyForm.setValues(row.original);
                                    setIsEditing(true)
                                    setPartyModal(true)
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
                data={partyData}
                enableTopToolbar={false}
            />
        </Box>
        <FloatingMenu
            m={5}
            right
            size={50}
            onClick={() => {
                partyForm.reset(); setIsEditing(false); setPartyModal(true);
            }}
        >
            <IconPlus color="white" />
        </FloatingMenu>
        <Modal
            opened={partyModal}
            onClose={() => { partyForm.reset(); setPartyModal(false) }} h="500px"
            title={isEditing ? "Edit Party" : "Add Party"}>
            <Box p={5} h={"80vh"}>
                <Grid>
                    <Grid.Col>
                        <TextInput label="Name" placeholder='Enter Name' {...partyForm.getInputProps("name")} />
                    </Grid.Col>
                    <Grid.Col>
                        <Select
                            label="Select Type"
                            placeholder="Select Type"
                            dropdownPosition="bottom"
                            data={['sender', 'supplier', 'receiver']}
                            {...partyForm.getInputProps("party_type")} />
                    </Grid.Col>
                    <Grid.Col>
                        <Flex align={"center"} justify={"right"}>
                            <Button onClick={isEditing ? editParty : addParty}>{isEditing ? "Edit Party" : "Save Party"}</Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Box>
        </Modal>
    </>
    )
}

export default Party