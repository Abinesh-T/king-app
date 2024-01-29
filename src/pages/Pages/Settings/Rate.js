import { ActionIcon, Box, Button, Flex, Grid, Modal, NumberInput, Select, Table, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { IconCirclePlus, IconEdit, IconTrash } from '@tabler/icons';
import AppHeader from 'components/AppHeader'
import { MantineReactTable } from 'mantine-react-table';
import React, { useEffect, useMemo, useState } from 'react'
import { api_add_rate, api_all_rate, api_edit_rate } from './rate.service';
import { showErrorToast, showSuccessToast } from 'utilities/Toast';

const Rate = () => {
    const theme = useMantineTheme();

    const rateForm = useForm({
        validateInputOnBlur: true,
        shouldUnregister: false,
        initialValues: {
            id: "",
            box: "",
            pcs: "",
            crate: "",
        },
    });

    useEffect(() => {
        api_all_rate().then(
            res => {
                if (res.success) {
                    console.log(res);
                    if (res?.data?.id !== undefined) {
                        rateForm.setFieldValue("box", res?.data?.box);
                        rateForm.setFieldValue("pcs", res?.data?.pcs);
                        rateForm.setFieldValue("crate", res?.data?.crate);
                    }
                } else {
                    showErrorToast({ title: "Error", message: res.message });
                }
            }
        ).catch(err => {
            console.log(err);
        })
    }, [])

    const addRate = async () => {
        console.log(rateForm.values);

        let isEditing = false;
        await api_all_rate().then(
            res => {
                if (res.success) {
                    console.log(res);
                    if (res?.data?.id !== undefined) {
                        isEditing = true;
                        rateForm.values.id = res.data.id;
                    }
                } else {
                    showErrorToast({ title: "Error", message: res.message });
                }
            }
        ).catch(err => {
            console.log(err);
        })

        if (isEditing) {
            const payload = {
                id: rateForm.values.id,
                box: rateForm.values.box,
                pcs: rateForm.values.pcs,
                crate: rateForm.values.crate,
            }

            await api_edit_rate(payload).then(
                res => {
                    if (res.success) {
                        console.log(res);
                        showSuccessToast({ title: "Success", message: res.message });
                    } else {
                        showErrorToast({ title: "Error", message: res.message });
                    }
                }
            ).catch(err => {
                console.log(err);
            })
        } else {
            const payload = {
                box: rateForm.values.box,
                pcs: rateForm.values.pcs,
                crate: rateForm.values.crate,
            }

            await api_add_rate(payload).then(
                res => {
                    if (res.success) {
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
    }

    return (<>
        <Box p={5}>
            <Flex align={"center"} justify={"center"} direction={"column"} >
                <Box p={5}>
                    <Grid maw={500}>
                        <Grid.Col>
                            <NumberInput min={0} label="Box Rate" placeholder='Enter Box Rate' {...rateForm.getInputProps("box")} />
                        </Grid.Col>
                        <Grid.Col>
                            <NumberInput min={0} label="Pcs Rate" placeholder='Enter Pcs Rate' {...rateForm.getInputProps("pcs")} />
                        </Grid.Col>
                        <Grid.Col>
                            <NumberInput min={0} label="CRate" placeholder='Enter CRate' {...rateForm.getInputProps("crate")} />
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