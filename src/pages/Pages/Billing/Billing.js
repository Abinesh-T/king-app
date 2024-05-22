import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  Radio,
  Select,
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
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useReactToPrint } from "react-to-print";
import { getAlteredSelectionParty, getUserDetails } from "services/helperFunctions";
import { showErrorToast, showSuccessToast } from "utilities/Toast";

import SetBilling from "./SetBilling";
import { api_all_billing, api_billing_by_id, api_delete_billing } from "./billing.service";
import { api_all_item } from "../Item/item.service";
import { api_all_party } from "../Party/party.service";

const confirm_delete_props = {
  title: "Please confirm delete billing",
  children: (
    <Text size="sm">
      Are you sure you want to delete this billing ? Everything related to this billing will be
      deleted.
    </Text>
  ),
  labels: { confirm: "Delete Billing", cancel: "Cancel" },
  onCancel: () => console.log("Cancel"),
  confirmProps: { color: "red" },
};

const Billing = () => {
  const theme = useMantineTheme();
  const [isSetBilling, setIsSetBilling] = useState(false);
  const [tableData, setTableData] = useState([]);
  // const [party, setParty] = useState([]);
  const [date, setDate] = useState(new Date());
  const [editingData, setEditingData] = useState(null);
  const [partyData, setPartyData] = useState([]);
  const [partySender, setPartySender] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [foot, setFoot] = useState([]);
  const [foots, setFoots] = useState([]);
  const [head, setHead] = useState([]);
  const [printBodyData, setPrintBodyData] = useState([]);
  const [isAllPrint, setIsAllPrint] = useState(false);
  const [itemData, setItemData] = useState([]);

  const fetch_item = useQuery("fetch_item", api_all_item, {
    refetchOnWindowFocus: false,
    onSuccess: res => {
      setItemData(res.data);
    },
  });

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
          foots: foots,
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
          foots: foots,
        })
      );
      printWindow.document.close();

      printWindow.print();
      printWindow.close();
      setIsAllPrint(false);
    }
  }, [isAllPrint]);

  const fetch_party = useQuery("fetch_party", api_all_party, {
    refetchOnWindowFocus: false,
    onSuccess: res => {
      setPartyData(getAlteredSelectionParty(res.data));
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
        //     <Text>Vehicle No: TNxxYxxxx</Text>
        //     <Text>Driver Name: Name</Text>
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
    api_all_billing(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
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

  const printRow = async (cell, isShowAmount) => {
    console.log(cell.row.original?.id);

    await api_billing_by_id(cell.row.original?.id)
      .then(res => {
        if (res.success) {
          console.log(res);
          let invoice = res.data;
          let items = invoice?.invoice_items;

          setMenuData(
            `
            <div style="font-size: 16px;">
            <b>Party: ${invoice?.reciever_name}</b> <br>
            <b>Date: ${invoice?.date}</b>
            </div>`
          );
          console.log(isShowAmount);

          let body = [];
          items.map((e, i) => {
            let row = [];
            row.push(e?.supplier_name);
            row.push(e.rate);
            row.push(e.item_name);
            row.push(e.qty);
            if (isShowAmount) {
              row.push(e.amount);
            }
            body.push(row);
          });

          if (isShowAmount) {
            setFoot(["Total", invoice?.total]);
            setFoots([
              ["SubTotal", invoice?.amount],
              ["Commission", invoice?.commission],
              ["Rent", invoice?.rent],
              ["Wages", invoice?.wages],
            ]);
            setHead(["Supplier", "Rate", "Item", "Qty", "Amount"]);
          } else {
            setFoot(["Total", invoice?.total]);
            setFoots([
              ["SubTotal", invoice?.amount],
              ["Commission", invoice?.commission],
              ["Rent", invoice?.rent],
              ["Wages", invoice?.wages],
            ]);
            setHead(["Supplier", "Rate", "Item", "Qty"]);
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
        accessorKey: "rate",
        header: "Rate",
        size: "auto",
      },
      {
        accessorKey: "qty",
        header: "Qty",
        size: "auto",
      },
      {
        accessorKey: "rent",
        header: "Rent",
        size: "auto",
      },
      {
        accessorKey: "wages",
        header: "Wages",
        size: "auto",
      },
      {
        accessorKey: "commission",
        header: "Commission",
        size: "auto",
      },
      {
        accessorKey: "total",
        header: "Total",
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
      onConfirm: async () => await deleteBilling(id),
    });
  };

  const deleteBilling = async id => {
    await api_delete_billing(id)
      .then(res => {
        if (res.success) {
          console.log(res);
          showSuccessToast({ title: "Success", message: res.message });
          api_all_billing(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
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

  const getEditBilling = async id => {
    await api_billing_by_id(id)
      .then(res => {
        if (res.success) {
          console.log(res);
          setEditingData(res.data);
          setIsSetBilling(true);
        } else {
          showErrorToast({ title: "Error", message: res.message });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getInvoicePrint = async (id, isShowAmount) => {
    let invoice_print = {
      menuData: <></>,
      foot: [],
      printBodyData: [],
    };

    await api_billing_by_id(id)
      .then(res => {
        if (res.success) {
          console.log(res);
          let invoice = res.data;
          let items = invoice?.invoice_items;

          invoice_print["menuData"] = `
            <div style="font-size: 16px;">
              <b>Party: ${invoice?.reciever_name}</b> <br>
              <b>Date: ${invoice?.date}</b>
            </div>`;

          let body = [];
          items.map((e, i) => {
            let row = [];
            row.push(e?.supplier_name);
            row.push(e.rate);
            row.push(e.item_name);
            row.push(e.qty);
            if (isShowAmount) {
              row.push(e.amount);
            }
            body.push(row);
          });

          if (isShowAmount) {
            invoice_print["foot"] = ["Total", invoice?.total];
            invoice_print["foots"] = [
              ["SubTotal", invoice?.amount],
              ["Commission", invoice?.commission],
              ["Rent", invoice?.rent],
              ["Wages", invoice?.wages],
            ];
          } else {
            invoice_print["foot"] = ["Total", invoice?.total];
            invoice_print["foots"] = [
              ["SubTotal", invoice?.amount],
              ["Commission", invoice?.commission],
              ["Rent", invoice?.rent],
              ["Wages", invoice?.wages],
            ];
          }
          invoice_print["printBodyData"] = body;
        } else {
          showErrorToast({ title: "Error", message: res.message });
        }
      })
      .catch(err => {
        console.log(err);
      });
    return invoice_print;
  };

  const getInvoicePrintElement = async isShowAmount => {
    let element_print = [];
    tableData.map(async (e, i) => {
      await getInvoicePrint(e.id, isShowAmount).then(data => {
        console.log(data);
        element_print.push(
          PrintModalTable({
            head: isShowAmount
              ? ["Supplier", "Rate", "Item", "Qty", "Amount"]
              : ["Supplier", "Rate", "Item", "Qty"],
            body: data?.printBodyData,
            children: data?.menuData,
            foot: data?.foot,
            foots: data?.foots,
          })
        );
      });
      if (tableData.length - 1 === i) {
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
      {isSetBilling ? (
        <>
          <AppHeader title="ADD BILLING" />
          <SetBilling
            setFetchDate={setDate}
            partyData={partyData}
            setEditingData={setEditingData}
            editingData={editingData}
            setIsSetBilling={setIsSetBilling}
          />
        </>
      ) : (
        <>
          <AppHeader title="BILLING" />
          <Box p={5}>
            <Flex mb={20} align={"center"} justify={"space-between"} gap={10}>
              <DatePickerInput w={120} label="Select Date" value={date} onChange={setDate} />
              {/* <Select
                                value={party}
                                onChange={setParty}
                                label="Party"
                                placeholder="Select Party"
                                searchable
                                data={[]}
                            /> */}
            </Flex>
            <MantineReactTable
              columns={columns}
              data={tableData}
              positionActionsColumn="last"
              enableRowActions
              enableColumnActions={false}
              renderRowActions={({ row }) => (
                <Flex>
                  <Tooltip label="Edit Billing">
                    <ActionIcon
                      ml={10}
                      sx={theme => ({ color: theme.colors.brand[7] })}
                      onClick={() => {
                        console.log(row.original.id);
                        getEditBilling(row.original.id);
                      }}
                    >
                      <IconEdit style={{ width: 20 }} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete Billing">
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
              setIsSetBilling(true);
            }}
          >
            <IconPlus color="white" />
          </FloatingMenu>
          <FloatingMenu
            m={5}
            left
            size={50}
            onClick={() => {
              setFoots(e => (e = []));
              getInvoicePrintElement(false);
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
              setFoots(e => (e = []));
              getInvoicePrintElement(true);
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
          foots={foots}
        />
      </div> */}
    </div>
  );
};

export default Billing;
