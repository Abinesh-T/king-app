import { Box, Flex, Text, useMantineTheme } from '@mantine/core'
import { IconArrowBigLeft, IconUserCircle } from '@tabler/icons';
import React from 'react'

const AppHeader = () => {

  const theme = useMantineTheme();

  const headerConfig = {
    height: "10vh",
    background: theme.colors.brand[8],
  }

  return (
    <>
      <Box h={headerConfig.height} bg={headerConfig.background} p={10}>
        <Flex align={"center"} justify={"space-between"} h={"100%"}>
          <IconArrowBigLeft color={"white"} />
          <Text color={"white"}>LOGO</Text>
          <IconUserCircle color={"white"} />
        </Flex>
      </Box>
    </>
  )
}

export default AppHeader