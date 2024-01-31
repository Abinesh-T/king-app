import { ActionIcon, Box, Button, Checkbox, Flex, Modal, Radio, Select, Text, Tooltip, useMantineTheme } from '@mantine/core';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import AppHeader from 'components/AppHeader';
import { IconArrowLeft, IconArrowRight, IconCirclePlus, IconEdit, IconPlus, IconPrinter, IconTrash } from '@tabler/icons';
import { DatePickerInput } from '@mantine/dates';
import { MantineReactTable } from 'mantine-react-table';
import FloatingMenu from 'components/FloatingMenu';
import { openConfirmModal } from '@mantine/modals';
import { PrintModal } from 'components/PrintModal';
import SetBilling from './SetBilling';
import { api_all_party } from '../Party/party.service';
import { getAlteredSelectionParty, getUserDetails } from 'services/helperFunctions';
import { useQuery } from 'react-query';

const confirm_delete_props = {
    title: "Please confirm delete billing",
    children: (
        <Text size="sm">
            Are you sure you want to delete this billing ? Everything related to this billing will be
            deleted.
        </Text>
    ),
    labels: { confirm: "Delete Billing", cancel: "Cancel" },
    onCancel: () => console.log("Cancel"),
    confirmProps: { color: "red" },
};

const Billing = () => {
    const theme = useMantineTheme();
    const [isSetBilling, setIsSetBilling] = useState(false);
    const [tableData, setTableData] = useState([]);
    // const [party, setParty] = useState([]);
    const [date, setDate] = useState(new Date());
    const [editingData, setEditingData] = useState(null);
    const [partyData, setPartyData] = useState([]);
    const [partySender, setPartySender] = useState(null);

    const fetch_party = useQuery("fetch_party", api_all_party, {
        refetchOnWindowFocus: false,
        onSuccess: res => {
            setPartyData(getAlteredSelectionParty(res.data));
            const user = getUserDetails();
            setPartySender(
                <>
                    <Flex align={"center"} justify={"center"} gap={5}>
                        <Text>{user.company_name}</Text>
                        <Text>{res.data.find((e, i) => e.party_type === "sender")?.name}</Text>
                    </Flex>
                    <Flex align={"center"} justify={"center"} direction={"column"} gap={5}>
                        <Text>{user.address}</Text>
                        <Text>Phone: {user.contact_no_left}, {user.contact_no_right}</Text>
                        <Text>Vehicle No: TNxxYxxxx</Text>
                        <Text>Driver Name: Name</Text>
                    </Flex>
                </>
            );
        },
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: "auto"
            },
            {
                accessorKey: 'name',
                header: 'Name',
                size: "auto"
            },
            {
                accessorKey: 'item',
                header: 'Item',
                size: "auto"
            },
            {
                accessorKey: 'rate',
                header: 'Rate',
                size: "auto"
            },
            {
                accessorKey: 'qty',
                header: 'Qty',
                size: "auto"
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                size: "auto"
            },
        ],
        [],
    );

    const openDeleteConfirmation = id => {
        openConfirmModal({
            ...confirm_delete_props,
            onConfirm: async () => await deleteBilling(id),
        });
    };

    const deleteBilling = async id => {
    };

    const getEditBilling = async (id) => {
    }

    return (
        <div>
            {isSetBilling ? <>
                <AppHeader title="ADD BILLING" /><SetBilling setFetchDate={setDate} partyData={partyData} setEditingData={setEditingData} editingData={editingData} setIsSetBilling={setIsSetBilling} /></> :
                <>
                    <AppHeader title="BILLING" />
                    <Box p={5}>
                        <Flex mb={20} align={"center"} justify={"space-between"} gap={10}>
                            <DatePickerInput w={120} label="Select Date" value={date} onChange={setDate} />
                            {/* <Select
                                value={party}
                                onChange={setParty}
                                label="Party"
                                placeholder="Select Party"
                                searchable
                                data={[]}
                            /> */}
                        </Flex>
                        <MantineReactTable
                            columns={columns}
                            data={tableData}
                            positionActionsColumn='last'
                            enableRowActions
                            enableColumnActions={false}
                            renderRowActions={({ row }) => (
                                <Flex>
                                    <Tooltip label="Edit Billing">
                                        <ActionIcon
                                            ml={10}
                                            sx={theme => ({ color: theme.colors.brand[7] })}
                                            onClick={() => {
                                                console.log(row.original.id);
                                                getEditBilling(row.original.id);
                                            }}
                                        >
                                            <IconEdit style={{ width: 20 }} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Delete Billing">
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
                            setIsSetBilling(true);
                        }}
                    >
                        <IconPlus color="white" />
                    </FloatingMenu>
                    <FloatingMenu
                        m={5}
                        left
                        size={50}
                        onClick={() => {
                        }}
                    >
                        <IconPrinter color="white" />
                    </FloatingMenu>
                </>
            }

        </div>
    )
}

export default Billing