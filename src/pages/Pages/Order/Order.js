import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  Radio,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { openConfirmModal } from "@mantine/modals";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCirclePlus,
  IconEdit,
  IconPlus,
  IconPrinter,
  IconTrash,
} from "@tabler/icons";
import AppHeader from "components/AppHeader";
import FloatingMenu from "components/FloatingMenu";
import { PrintModalHtml, PrintModalTable, getMerged } from "components/PrintModalHtml";
import EscPosEncoder from "esc-pos-encoder";
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useReactToPrint } from "react-to-print";
import { printDevice } from "services/bluetoothFunction";
import { checkPlatform, getAlteredSelectionParty, getUserDetails } from "services/helperFunctions";
import { showErrorToast, showSuccessToast } from "utilities/Toast";

import SetOrder from "./SetOrder";
import { api_all_order, api_delete_order, api_order_by_id } from "./order.service";
import { api_all_item } from "../Item/item.service";
import { api_all_party } from "../Party/party.service";

const confirm_delete_props = {
  title: "Please confirm delete order",
  children: (
    <Text size="sm">
      Are you sure you want to delete this order ? Everything related to this order will be deleted.
    </Text>
  ),
  labels: { confirm: "Delete Order", cancel: "Cancel" },
  onCancel: () => console.log("Cancel"),
  confirmProps: { color: "red" },
};

const Order = () => {
  const theme = useMantineTheme();
  const [isSetOrder, setIsSetOrder] = useState(false);
  const [isAllPrint, setIsAllPrint] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [foot, setFoot] = useState([]);
  const [head, setHead] = useState([]);
  const [date, setDate] = useState(new Date());
  const [editingData, setEditingData] = useState(null);
  const [printBodyData, setPrintBodyData] = useState([]);
  const [partyData, setPartyData] = useState([]);
  const [partySender, setPartySender] = useState(null);
  const [itemData, setItemData] = useState([]);
  const [sender, setSenderData] = useState([]);

  const fetch_item = useQuery("fetch_item", api_all_item, {
    refetchOnWindowFocus: false,
    onSuccess: res => {
      setItemData(res.data);
    },
  });

  const fetch_party = useQuery("fetch_party", api_all_party, {
    refetchOnWindowFocus: false,
    onSuccess: res => {
      setPartyData(getAlteredSelectionParty(res.data));
      setSenderData(res.data.find((e, i) => e.party_type === "sender")?.name);
      const user = getUserDetails();
      setPartySender(
        // <>
        //   <Flex align={"center"} justify={"center"} gap={5}>
        //     <Text>{user.company_name}</Text>
        //     <Text>{res.data.find((e, i) => e.party_type === "sender")?.name}</Text>
        //   </Flex>
        //   <Flex align={"center"} justify={"center"} direction={"column"} gap={5}>
        //     <Text>{user.address}</Text>
        //     <Text>
        //       Phone: {user.contact_no_left}, {user.contact_no_right}
        //     </Text>
        //     <Text>Vehicle No: {user?.vehicle_no}</Text>
        //     <Text>Driver Name: {user?.driver_name}</Text>
        //   </Flex>
        // </>
        `<div style="text-align: center;">
        <p style="font-size: 22px">${user.company_name}</p>
          <p>${res.data.find((e, i) => e.party_type === "sender")?.name}</p>
        </div>
        <div style="text-align: center;">
          <p>${user.address}</p>
          <p>Phone: ${user.contact_no_left}, ${user.contact_no_right}</p>
          <p>Vehicle No: ${user?.vehicle_no}</p>
          <p>Driver Name: ${user?.driver_name}</p>
        </div>`
      );
    },
  });

  useEffect(() => {
    api_all_order(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
      .then(res => {
        if (res.success) {
          setTableData(res.data);
          console.log(res);
        } else {
          showErrorToast({ title: "Error", message: res.message });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [date]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (printBodyData.length) {
      const printWindow = window.open("", "", "width=600,height=600");
      printWindow.document.open();
      printWindow.document.write(
        PrintModalHtml({
          title: partySender,
          head: head,
          body: printBodyData,
          children: menuData,
          foot: foot,
        })
      );
      printWindow.document.close();

      printWindow.print();
      printWindow.close();
    }
  }, [printBodyData]);

  useEffect(() => {
    if (isAllPrint) {
      const printWindow = window.open("", "", "width=600,height=600");
      printWindow.document.open();
      printWindow.document.write(
        PrintModalHtml({
          title: partySender,
          head: head,
          body: printBodyData,
          children: menuData,
          foot: foot,
        })
      );
      printWindow.document.close();

      printWindow.print();
      printWindow.close();
      setIsAllPrint(false);
    }
  }, [isAllPrint]);

  const printReceipt = async (order, isShowAmount) => {
    await api_order_by_id(order.id)
      .then(res => {
        if (res.success) {
          console.log(res);
          let order = res.data;
          let items = order?.order_items;
          const user = getUserDetails();
          const divider = "*".repeat(48);
          const encoder = new EscPosEncoder();
          encoder.initialize();

          encoder
            .align("center")
            .bold(true)
            .text(sender)
            .newline()
            .bold(true)
            .text(user.company_name)
            .newline()
            .text(user.address)
            .newline()
            .text("Phone No:-" + user.contact_no_left + "," + user.contact_no_right)
            .newline()
            .text("Vehicle No:" + user?.vehicle_no)
            .newline()
            .text("Driver Name:" + user?.driver_name)
            .newline()
            .align("center")
            .text(divider)
            .newline()
            .newline()
            .align("left")
            .text("Party:" + order?.reciever_name)
            .newline()
            .align("left")
            .text("Date:" + order?.date)
            .newline()
            .align("center")
            .text(divider)
            .newline();
          let footer, header, items_, table_alignment;
          if (isShowAmount) {
            table_alignment = [
              { width: 5, marginRight: 2, align: "left" },
              { width: 10, align: "right" },
              { width: 6, align: "right" },
              { width: 6, align: "right" },
              { width: 6, align: "right" },
              { width: 8, align: "right" },
            ];
            header = [
              ["Supplier", "Item", "Box", "Pcs", "Crt", "Amount"],
              [" ", " ", " ", " ", " ", " "],
            ];
            items_ = items.map((e, i) => {
              let row = [];
              row.push(e.supplier_name);
              row.push(e.item_name);
              row.push(e.box.toString());
              row.push(e.pcs.toString());
              row.push(e.crate.toString());
              row.push(e.amount.toString());
              return row;
            });
            footer = [
              [" ", " ", " ", " ", " ", " "],
              [
                "Total",
                items.length + " items",
                order?.box.toString(),
                order?.pcs.toString(),
                order?.crate.toString(),
                order?.amount.toString(),
              ],
            ];
          } else {
            table_alignment = [
              { width: 6, marginRight: 2, align: "left" },
              { width: 12, align: "right" },
              { width: 6, align: "right" },
              { width: 6, align: "right" },
              { width: 6, align: "right" },
            ];
            header = [
              ["Supplier", "Item", "Box", "Pcs", "Crt"],
              [" ", " ", " ", " ", " "],
            ];
            items_ = items.map((e, i) => {
              let row = [];
              row.push(e.supplier_name);
              row.push(e.item_name);
              row.push(e.box.toString());
              row.push(e.pcs.toString());
              row.push(e.crate.toString());
              return row;
            });
            footer = [
              [" ", " ", " ", " ", " "],
              [
                "Total",
                items.length + " items",
                order?.box.toString(),
                order?.pcs.toString(),
                order?.crate.toString(),
              ],
            ];
          }
          let row_content = [...header, ...items_, ...footer];

          encoder.table(table_alignment, row_content);
          encoder.align("center").text(divider).newline();

          encoder
            .align("center") // Center the following text
            .text("Thank You for Your Order!") // Your Thank You message
            .newline() // Your Thank You message
            .text(" ")
            .newline()
            .text(" ")
            .newline()
            .text(" ")
            .newline();

          encoder.newline().cut("full");

          const commands = encoder.encode();
          printDevice(commands);
          return;
        } else {
          showErrorToast({ title: "Error", message: res.message });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const printRow = async (cell, isShowAmount) => {
    console.log(cell.row.original?.id);
    checkPlatform()
      .then(platform => {
        printReceipt(cell.row.original, false);
        return;
      })
      .catch(error => {
        console.error(error);
      });

    await api_order_by_id(cell.row.original?.id)
      .then(res => {
        if (res.success) {
          console.log(res);
          let order = res.data;
          let items = order?.order_items;

          setMenuData(
            `
            <div style="font-size: 16px;">
              <b>Party: ${order?.reciever_name}</b> <br>
              <b>Date: ${order?.date}</b>
            </div>`
          );
          console.log(isShowAmount);

          let body = [];
          items.map((e, i) => {
            let row = [];
            row.push(e.supplier_name);
            row.push(e.item_name);
            row.push(e.box);
            row.push(e.pcs);
            row.push(e.crate);
            if (isShowAmount) {
              row.push(e.amount);
            }
            body.push(row);
          });

          if (isShowAmount) {
            setFoot([
              "Total",
              items.length + " items",
              order?.box,
              order?.pcs,
              order?.crate,
              order?.amount,
            ]);
            setHead(["Supplier", "Item", "Box", "Pcs", "crate", "Amount"]);
          } else {
            setFoot(["Total", items.length + " items", order?.box, order?.pcs, order?.crate]);
            setHead(["Supplier", "Item", "Box", "Pcs", "crate"]);
          }
          setPrintBodyData(body);
        } else {
          showErrorToast({ title: "Error", message: res.message });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        size: "auto",
      },
      {
        accessorKey: "reciever_name",
        header: "Name",
        size: "auto",
      },
      {
        accessorKey: "box",
        header: "Box",
        size: "auto",
      },
      {
        accessorKey: "pcs",
        header: "Pcs",
        size: "auto",
      },
      {
        accessorKey: "crate",
        header: "Crate",
        size: "auto",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        size: "auto",
      },
      {
        accessorKey: "date",
        header: "Date",
        size: "auto",
      },
      {
        header: "Print",
        size: "auto",
        Cell: ({ cell }) => {
          return (
            <Flex gap={5}>
              <Tooltip label="Print without amount">
                <Box
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    printRow(cell, false);
                  }}
                >
                  <IconPrinter color={"black"} />
                </Box>
              </Tooltip>
              <Tooltip label="Print with amount">
                <Box
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    printRow(cell, true);
                  }}
                >
                  <IconPrinter color={theme.colors.brand[7]} />
                </Box>
              </Tooltip>
            </Flex>
          );
        },
      },
    ],
    []
  );

  const openDeleteConfirmation = id => {
    openConfirmModal({
      ...confirm_delete_props,
      onConfirm: async () => await deleteOrder(id),
    });
  };

  const deleteOrder = async id => {
    await api_delete_order(id)
      .then(res => {
        if (res.success) {
          console.log(res);
          showSuccessToast({ title: "Success", message: res.message });
          api_all_order(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
            .then(res => {
              if (res.success) {
                setTableData(res.data);
                console.log(res);
              } else {
                showErrorToast({ title: "Error", message: res.message });
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          showErrorToast({ title: "Error", message: res.message });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getEditOrder = async id => {
    await api_order_by_id(id)
      .then(res => {
        if (res.success) {
          console.log(res);
          setEditingData(res.data);
          setIsSetOrder(true);
        } else {
          showErrorToast({ title: "Error", message: res.message });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getOrdersPrint = async (id, isShowAmount) => {
    let order_print = {
      menuData: <></>,
      foot: [],
      printBodyData: [],
    };
    await api_order_by_id(id)
      .then(res => {
        if (res.success) {
          // console.log(res);
          let order = res.data;
          let items = order?.order_items;

          order_print["menuData"] =
            // <Flex direction={"column"} gap={5}>
            //   <Text color="black" fw={500} fz={"lg"}>
            //     Party: {order?.reciever_name}
            //   </Text>
            //   <Text color="black" fw={500} fz={"lg"}>
            //     Date: {order?.date}
            //   </Text>
            // </Flex>

            `
            <div style="font-size: 16px;">
              <b>Party: ${order?.reciever_name}</b> <br>
              <b>Date: ${order?.date}</b>
            </div>`;

          let body = [];
          items.map((e, i) => {
            // console.log(itemData, e.item);
            // let item = itemData.find(v => v.id === e.item);
            // console.log(item?.name);
            let row = [];
            row.push(e.supplier_name);
            row.push(e.item_name);
            row.push(e.box);
            row.push(e.pcs);
            row.push(e.crate);
            if (isShowAmount) {
              row.push(e.amount);
            }
            body.push(row);
          });

          if (isShowAmount) {
            order_print["foot"] = [
              "Total",
              items.length + " items",
              order?.box,
              order?.pcs,
              order?.crate,
              order?.amount,
            ];
          } else {
            order_print["foot"] = [
              "Total",
              items.length + " items",
              order?.box,
              order?.pcs,
              order?.crate,
            ];
          }
          order_print["printBodyData"] = body;
        } else {
          showErrorToast({ title: "Error", message: res.message });
        }
      })
      .catch(err => {
        console.log(err);
      });
    return order_print;
  };

  const getOrdersPrintElement = async isShowAmount => {
    let element_print = [];
    tableData.map(async (e, i) => {
      await getOrdersPrint(e.id, isShowAmount).then(data => {
        console.log(data);
        element_print.push(
          PrintModalTable({
            head: isShowAmount
              ? ["Supplier", "Item", "Box", "Pcs", "crate", "Amount"]
              : ["Supplier", "Item", "Box", "Pcs", "crate"],
            body: data?.printBodyData,
            children: data?.menuData,
            foot: data?.foot,
          })
        );
      });
      if (tableData.length - 1 === i) {
        console.log(element_print);

        let orders_element = `<div>
            ${getMerged(element_print.map((e, i) => `${e}`))}
          </div>`;
        setMenuData(orders_element);
        setFoot([]);
        setPrintBodyData([]);
        setHead([]);
        setIsAllPrint(true);
      }
    });
  };

  return (
    <div>
      {isSetOrder ? (
        <>
          <AppHeader title="ADD ORDER" />
          <SetOrder
            setFetchDate={setDate}
            partyData={partyData}
            setEditingData={setEditingData}
            editingData={editingData}
            setIsSetOrder={setIsSetOrder}
          />
        </>
      ) : (
        <>
          <AppHeader title="ORDER" />
          <Box p={5}>
            <Flex mb={20} align={"center"} justify={"space-between"} gap={10}>
              <DatePickerInput w={120} label="Select Date" value={date} onChange={setDate} />
            </Flex>
            <MantineReactTable
              columns={columns}
              data={tableData}
              positionActionsColumn="last"
              enableRowActions
              enableColumnActions={false}
              renderRowActions={({ row }) => (
                <Flex>
                  <Tooltip label="Edit Order">
                    <ActionIcon
                      ml={10}
                      sx={theme => ({ color: theme.colors.brand[7] })}
                      onClick={() => {
                        console.log(row.original.id);
                        getEditOrder(row.original.id);
                      }}
                    >
                      <IconEdit style={{ width: 20 }} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete Order">
                    <ActionIcon
                      sx={theme => ({ color: theme.colors.red[6] })}
                      ml={10}
                      onClick={() => {
                        openDeleteConfirmation(row.original.id);
                      }}
                    >
                      <IconTrash style={{ width: 20 }} />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              )}
            />
          </Box>
          <FloatingMenu
            m={5}
            right
            size={50}
            onClick={() => {
              setIsSetOrder(true);
            }}
          >
            <IconPlus color="white" />
          </FloatingMenu>
          <FloatingMenu
            m={5}
            left
            size={50}
            onClick={() => {
              getOrdersPrintElement(false);
            }}
          >
            <IconPrinter color="black" />
          </FloatingMenu>
          <FloatingMenu
            m={5}
            ml={60}
            left
            size={50}
            onClick={() => {
              getOrdersPrintElement(true);
            }}
          >
            <IconPrinter color="white" />
          </FloatingMenu>
        </>
      )}
      {/* <div style={{ display: "none" }}>
        <PrintModal
          title={partySender}
          head={head}
          body={printBodyData}
          ref={componentRef}
          children={menuData}
          foot={foot}
        />
      </div> */}
    </div>
  );
};

export default Order;
