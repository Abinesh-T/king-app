import { Box, Button, Flex, Grid, Modal, Select, Table, Text, TextInput, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconCirclePlus } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import { MantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react'

const Party = () => {
    const theme = useMantineTheme();
    const [partyModal, setPartyModal] = useState(false);
    const [partyData, setPartyData] = useState([]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'firstname',
                header: 'First Name',
                size: "auto"
            },
            {
                accessorKey: 'lastname',
                header: 'Last Name',
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
            firstname: "",
            lastname: "",
            type: "",
        },
    });

    const addParty = () => {
        console.log(partyForm.values);
        setPartyData([...partyData, partyForm.values])
        setPartyModal(false)
    }

    return (<>
        <AppHeader />
        <Box p={5}>
            <Flex p={10} gap={10}>
                <Text fz={"lg"} fw={600}>PARTY</Text>
                <IconCirclePlus style={{ cursor: "pointer" }} onClick={() => { setPartyModal(true) }} color={theme.colors.brand[8]} />
            </Flex>
            <MantineReactTable
                columns={columns}
                data={partyData}
                enableTopToolbar={false}
            />
        </Box>
        <Modal opened={partyModal} onClose={() => { setPartyModal(false) }} title="Add Party">
            <Box p={5}>
                <Grid>
                    <Grid.Col>
                        <TextInput label="First Name" placeholder='Enter First Name' {...partyForm.getInputProps("firstname")} />
                    </Grid.Col>
                    <Grid.Col>
                        <TextInput label="Last Name" placeholder='Enter Last Name' {...partyForm.getInputProps("lastname")} />
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
                            <Button onClick={addParty}>Save Party</Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Box>
        </Modal>
    </>
    )
}

export default Party