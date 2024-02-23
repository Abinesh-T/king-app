import { Box, Button, Flex, Grid, Modal, Radio, Text, useMantineTheme } from "@mantine/core";
import { IconPrinter } from "@tabler/icons";
import React, { useEffect, useState } from "react";

const Printer = () => {
  const theme = useMantineTheme();
  const [modalOpened, setModalOpened] = useState(false);
  const [printerList, setPrinterList] = useState([]);
  const [printerSelected, setPrinterSelected] = useState("None");

  useEffect(() => {
    setPrinterList(["Printer1", "Printer2", "Printer3"]);

    setPrinterSelected(localStorage.getItem("printer"));
  }, []);

  useEffect(() => {
    localStorage.setItem("printer", printerSelected);
  }, [printerSelected]);

  return (
    <Box p={5} mt={10}>
      <Flex align={"center"} justify={"center"} direction={"column"}>
        <Box p={5}>
          <Grid maw={500}>
            <Grid.Col>
              <Flex align={"center"} gap={"lg"}>
                <IconPrinter color={theme.colors.brand[8]} />
                <Text fw={"bold"}>{printerSelected}</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col>
              <Flex align={"center"}>
                <Button
                  onClick={() => {
                    setModalOpened(true);
                  }}
                >
                  Select Printer
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
        </Box>
      </Flex>
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
        }}
        title="Select Printer"
      >
        <Flex direction={"column"} justify={"center"} gap={"lg"}>
          {printerList?.map((printer, index) => (
            <Radio
              key={index}
              fw={"bold"}
              label={printer}
              variant="outline"
              checked={printerSelected === printer}
              onChange={event => setPrinterSelected(event.currentTarget.checked ? printer : "None")}
            />
          ))}
        </Flex>
      </Modal>
    </Box>
  );
};

export default Printer;
