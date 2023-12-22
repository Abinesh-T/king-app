import {
  Box,
  Text,
} from "@mantine/core";
import AppHeader from "components/AppHeader";
import React from "react";

const Home = () => {

  return (
    <>
      <AppHeader />
      <Box p={20}>
        <Text>
          Home Page
        </Text>
      </Box>
    </>
  );
};

export default Home;
