import React, { use, useEffect, useState } from "react";
import { showAllUsers } from "../../../Services/userService";
import { getAllPayments } from "../../../Services/paymentServices";
import BarChart from "../../../components/BarChart";
import { fetchAllOrders } from "../../../Services/orderService";

const DashBoardGraphs = () => {
  const [users, setUsers] = useState([]);
  const [paymentsDetails, setPaymentsDetails] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      await showAllUsers()
        .then((res) => {
          const result = res.details;
          setUsers(result);
        })
        .catch((err) => console.log(err));
    };
    const fetchPaymentDetails = async () => {
      await getAllPayments()
        .then((res) => {
          const result = res.data.paymentDetails;
          setPaymentsDetails(result);
        })
        .catch((err) => console.log(err));
    };

    fetchUserDetails();
    fetchPaymentDetails();
  }, []);

  const getMonthFromDate = (created_date) => {
    const date = new Date(created_date);
    return date.getMonth();
  };

  const entrollmentsPerMonth = (users) => {
    const counts = Array(12).fill(0);
    users &&
      users.forEach((user) => {
        const month = getMonthFromDate(user.created_at);
        counts[month]++;
      });
    return counts;
  };
  const entrollmentsCounts = users.length > 0 && entrollmentsPerMonth(users);

  const entrollmentsData = {
    label: "Entrollments",
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    values: entrollmentsCounts,
  };

  const paymentsPerMonth = (paymentsDetails) => {
    const amount = Array(12).fill(0);
    paymentsDetails &&
      paymentsDetails.forEach((payment) => {
        const month = getMonthFromDate(payment.createdAt);
        amount[month] = Number(amount[month])+ Number(payment.totalAmount);

      });
    return amount;
  };
  const payments = paymentsPerMonth(paymentsDetails);

  const paymentsData = {
    label: "Amount",
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    values: payments,
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center fw-bolder fs-1 mb-4">Business Overview</h1>
      <div className="row">
        <div
          className="col-12"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 10vw 10vw 10vw",
          }}
        >
          <h3 className="text-start pl-4 w-100" style={{color: "#bd2752"}}>Users registrations per Month</h3>
          <BarChart data={entrollmentsData} />
        </div>
        <div
          className="col-12"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 10vw 10vw 10vw",
          }}
        >
          <h3 className="text-start pl-5 w-100" style={{color: "#bd2752"}}>Incomes per Month</h3>
          <BarChart data={paymentsData} />
        </div>
      </div>
    </div>
  );
};

export default DashBoardGraphs;
