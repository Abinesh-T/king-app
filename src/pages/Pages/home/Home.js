import {
  Box,
  Flex,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconBusinessplan, IconPaperBag, IconTruckDelivery, IconUser } from "@tabler/icons";
import AppHeader from "components/AppHeader";
import React from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const info = [
    {
      id: 1,
      icon: <IconUser color="grey" size={40} />,
      title: "Party",
      link: "/party",
    },
    {
      id: 2,
      icon: <IconPaperBag color="grey" size={40} />,
      title: "Item",
      link: "/item",
    },
    {
      id: 3,
      icon: <IconBusinessplan color="grey" size={40} />,
      title: "Rate",
      link: "/rate",
    },
    {
      id: 4,
      icon: <IconTruckDelivery color="grey" size={40} />,
      title: "Order",
      link: "/order",
    },
  ]

  return (
    <>
      <AppHeader />
      <Flex align={"center"} wrap={"wrap"} p={"5%"} gap={"6%"}>
        {
          info.map((e, i) => (
            <Flex key={i} onClick={() => { navigate(e.link) }} direction={"column"} align={"center"} justify={"center"} w={"47%"} mb={"6%"} h={"132px"} style={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px", borderRadius: "5%", cursor: "pointer" }}>
              {e.icon}
              <Text fz={20} fw={600} color={theme.colors.brand[4]}>{e.title}</Text>
            </Flex>
          ))
        }
      </Flex>
    </>
  );
};

export default Home;
