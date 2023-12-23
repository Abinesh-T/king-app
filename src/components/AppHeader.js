import { Box, Button, Drawer, Flex, NavLink, Text, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconActivity, IconChevronRight, IconMenu2, IconUserCircle } from '@tabler/icons';
import React, { useRef } from 'react'
import { useNavigate } from 'react-router';

const AppHeader = () => {

  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const headerConfig = {
    height: "10vh",
    background: theme.colors.brand[8],
  }

  return (
    <>
      <Box h={headerConfig.height} bg={headerConfig.background} p={10}>
        <Flex align={"center"} justify={"space-between"} h={"100%"}>
          <IconMenu2 color={"white"} onClick={open} />
          <Text color={"white"}>KING APP</Text>
          <IconUserCircle color={"white"} />
        </Flex>
      </Box>
      <Drawer size={"xs"} opened={opened} onClose={close} title="KING APP">
        <Button fz={'md'} w={"100%"} variant='subtle' onClick={() => { navigate("/") }}>Home</Button>
        <Button fz={'md'} w={"100%"} variant='subtle' onClick={() => { navigate("/party") }}>Party</Button>
        <Button fz={'md'} w={"100%"} variant='subtle' onClick={() => { navigate("/item") }}>Item</Button>
        <Button fz={'md'} w={"100%"} variant='subtle' onClick={() => { navigate("/order") }}>Order</Button>
      </Drawer>
    </>
  )
}

export default AppHeader