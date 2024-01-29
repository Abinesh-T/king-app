import { Box, Button, Flex, Grid, TextInput } from '@mantine/core'
import React from 'react'

const General = () => {
    return (
        <Box p={5}>
            <Flex align={"center"} justify={"center"} direction={"column"} >
                <Box p={5}>
                    <Grid maw={500}>
                        <Grid.Col>
                            <TextInput label="Driver Name" />
                        </Grid.Col>
                        <Grid.Col>
                            <TextInput label="Vehicle No" />
                        </Grid.Col>
                        <Grid.Col>
                            <Flex align={"center"} justify={"right"}>
                                <Button>Save</Button>
                            </Flex>
                        </Grid.Col>
                    </Grid>
                </Box>
            </Flex>
        </Box>

    )
}

export default General