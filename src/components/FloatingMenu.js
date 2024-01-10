import { Flex, useMantineTheme } from "@mantine/core";
import React from "react";

const FloatingMenu = props => {
    const theme = useMantineTheme();

    return (
        <Flex
            align={"center"}
            justify={"center"}
            bg={theme.colors.brand[8]}
            w={props.size}
            h={props.size}
            onClick={props.onClick}
            m={props.m}
            p={props.p}
            mr={props.mr}
            ml={props.ml}
            style={{
                position: "fixed",
                bottom: "0",
                right: props.right ? "0" : "auto",
                left: props.left ? "0" : "auto",
                borderRadius: "50%",
                zIndex: "10",
            }}
        >
            {props.children}
        </Flex>
    );
};

export default FloatingMenu;