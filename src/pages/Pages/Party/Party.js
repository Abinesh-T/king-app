import { ActionIcon, Box, Button, Flex, Grid, Modal, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { IconCirclePlus, IconEdit, IconTrash } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import { MantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react'

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
    const [nextId, setNextId] = useState(1);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: "auto"
            },
            {
                accessorKey: 'type',
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
            type: "",
        },
    });

    const addParty = () => {
        partyForm.values.id = nextId;
        setNextId(e => e + 1);
        console.log(partyForm.values);
        setPartyData([...partyData, partyForm.values])
        setPartyModal(false)
    }

    const deleteParty = async id => {
        console.log("Deleted", id);
    }

    const openDeleteConfirmation = id => {
        openConfirmModal({
            ...confirm_delete_props,
            onConfirm: async () => await deleteParty(id),
        });
    };

    const editParty = (values) => {
        console.log(values);
        partyForm.setValues(values);
        setIsEditing(true)
        setPartyModal(true)
    }

    return (<>
        <AppHeader />
        <Box p={5}>
            <Flex p={10} gap={10}>
                <Text fz={"lg"} fw={600}>PARTY</Text>
                <IconCirclePlus style={{ cursor: "pointer" }} onClick={() => { partyForm.reset(); setIsEditing(false); setPartyModal(true) }} color={theme.colors.brand[8]} />
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
                                    editParty(row.original)
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
        <Modal
            opened={partyModal}
            onClose={() => { partyForm.reset(); setPartyModal(false) }}
            title={isEditing ? "Edit Party" : "Add Party"}>
            <Box p={5}>
                <Grid>
                    <Grid.Col>
                        <TextInput label="Name" placeholder='Enter Name' {...partyForm.getInputProps("name")} />
                    </Grid.Col>
                    <Grid.Col>
                        <Select
                            label="Select Type"
                            placeholder="Select Type"
                            data={['Sender', 'Supplier', 'Receiver']}
                            {...partyForm.getInputProps("type")} />
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