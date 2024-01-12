import { Box, Button, Drawer, Flex, NavLink, Text, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconActivity, IconChevronRight, IconHome, IconLogout, IconMenu2, IconUserCircle } from '@tabler/icons';
import React, { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router';

const AppHeader = (props) => {

  const theme = useMantineTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const headerConfig = {
    height: "10vh",
    background: theme.colors.brand[8],
  }

  return (
    <>
      <Box h={headerConfig.height} bg={headerConfig.background} p={10}>
        <Flex align={"center"} justify={"space-between"} h={"100%"}>
          <IconHome color={"white"} onClick={() => { navigate("/") }} />
          <Text color={"white"}>{props.title ? props.title : "KING APP"}</Text>
          <IconLogout color={"white"} />
        </Flex>
      </Box>
    </>
  )
}

export default AppHeader