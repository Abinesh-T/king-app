import { ActionIcon, Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { IconCirclePlus, IconEdit, IconTrash } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import { MantineReactTable } from 'mantine-react-table';
import React, { useEffect, useMemo, useState } from 'react'

const Rate = () => {
    const theme = useMantineTheme();
    const [rateData, setRateData] = useState({});

    const rateForm = useForm({
        validateInputOnBlur: true,
        shouldUnregister: false,
        initialValues: {
            box_rate: "",
            pcs_rate: "",
        },
    });

    const addRate = () => {
        console.log(rateForm.values);
        setRateData(rateForm.values);
    }

    return (<>
        <AppHeader title="RATE" />
        <Box p={5}>
            <Flex align={"center"} justify={"center"} direction={"column"} >
                <Box p={5}>
                    <Grid maw={500}>
                        <Grid.Col>
                            <NumberInput min={0} label="Box Rate" placeholder='Enter Box Rate' {...rateForm.getInputProps("box_rate")} />
                        </Grid.Col>
                        <Grid.Col>
                            <NumberInput min={0} label="Pcs Rate" placeholder='Enter Pcs Rate' {...rateForm.getInputProps("pcs_rate")} />
                        </Grid.Col>
                        <Grid.Col>
                            <Flex align={"center"} justify={"right"}>
                                <Button onClick={addRate}>{"Save Rate"}</Button>
                            </Flex>
                        </Grid.Col>
                    </Grid>
                </Box>
            </Flex>
        </Box>
    </>
    )
}

export default Rate