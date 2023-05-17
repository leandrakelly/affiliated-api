/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";

import { Navigate } from "react-router-dom";
import { Button, Card, Collapse, Input, Table } from "antd";
import "./index.css";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { ColumnsType } from "antd/es/table";
import { getTransactions, uploadTransactions } from "../../api/transactionApi";
import { logoutAndReload } from "../../utils/AuthUtils";
import { formatCurrency } from "../../utils/formatCurrency";

type TransactionsTypeEnum = {
  PRODUCER_SALE: "PRODUCER_SALE";
  AFFILIATE_SALE: "AFFILIATE_SALE";
  PAID_COMMISSION: "PAID_COMMISSION";
  RECEIVED_COMMISSION: "RECEIVED_COMMISSION";
};

interface Product {
  id: string;
  name: string;
}

interface Seller {
  id: string;
  name: string;
}

interface Transaction {
  id: number;
  value: number;
  type: keyof TransactionsTypeEnum;
  date: string;
  product: Product;
  seller: Seller;
}

interface TransactionsGrouped {
  earnings: number;
  name: string;
  transactions: Transaction[];
}

export const Transactions = () => {
  const [transactions, setTransactions] = useState<TransactionsGrouped[]>([]);
  const [errMsg, setErrMsg] = useState("");

  const errRef = useRef<HTMLParagraphElement | null>(null);

  const { md } = useBreakpoint();
  const { Panel } = Collapse;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      <Navigate to="/login" state={{ from: location }} replace />;
    } else {
      fetchTransactions();
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err: any) {
      setErrMsg(err.message);
      errRef.current?.focus();
    }
  };

  const handleFileUpload = async (file: File | null) => {
    setErrMsg("");
    if (file) {
      if (file.type !== "text/plain") {
        setErrMsg("Invalid file format. Please upload a .txt file.");
        return;
      }
      try {
        await uploadTransactions(file);
        fetchTransactions();
      } catch (err: any) {
        setErrMsg(err.message);
        errRef.current?.focus();
      }
    }
  };

  function transformDateToBrazilianFormat(dateString: string | number | Date) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;

    return formattedDate;
  }

  const columns: ColumnsType<Transaction> = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product: Product) => product.name,
    },
    {
      title: "Seller",
      dataIndex: "seller",
      key: "seller",
      render: (seller: Seller) => seller.name,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => transformDateToBrazilianFormat(date),
    },
  ];

  return (
    <div className="container">
      <div className="transactions-container">
        <Button
          type="primary"
          onClick={logoutAndReload}
          className="logout-button"
          style={{
            width: 100,
          }}
        >
          Logout
        </Button>
        <h1>Transactions</h1>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
      </div>
      <label htmlFor="fileInput">Upload File</label>
      <Input
        id="fileInput"
        type="file"
        accept=".txt"
        onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
      />
      <Collapse
        accordion
        style={{
          marginTop: 20,
          backgroundColor: "#fff",
        }}
      >
        {transactions?.map((group, index) =>
          md ? (
            <Panel
              header={`${group.name} - Earnings: ${formatCurrency(
                group.earnings
              )}`}
              key={group.name}
            >
              <Table
                key={`table-${group.name}-${index}`}
                dataSource={group.transactions}
                columns={columns}
              />
            </Panel>
          ) : (
            <Card
              title={`${group.name} - Earnings: ${formatCurrency(
                group.earnings
              )}`}
              key={group.name}
              className="transaction-card"
            >
              {group.transactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <p>
                    <span className="label">Product:</span>
                    {transaction.product.name}
                  </p>
                  <p>
                    <span className="label">Seller:</span>
                    {transaction.seller.name}
                  </p>
                  <p>
                    <span className="label">Value:</span>
                    {formatCurrency(transaction.value)}
                  </p>
                  <p>
                    <span className="label">Date:</span> {transaction.date}
                  </p>
                </div>
              ))}
            </Card>
          )
        )}
      </Collapse>
    </div>
  );
};
