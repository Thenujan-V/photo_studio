import React, { useRef } from 'react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const Invoice = ({ details }) => {
    console.log(details)
    const { orderDetails, paymentMethod, deliveryDetails} = details

    const studioDetails = {
        name: "Studio Edge",
        phone: "011-2345678",
        address: "123 Main Street, Colombo 07"
        };
        const order = {
            orderId: "ORD12345",
            paymentMethod: "Cash",
            items: [
                {
                name: "Wedding Photo Frame",
                price: 2500,
                quantity: 2
                },
                {
                name: "Canvas Print",
                price: 3000,
                quantity: 1
                }
            ],
            deliveryDetails: {
                name: "Kamal Perera",
                phone: "0771234567",
                address: "No 12, Galle Road, Colombo"
            }
            };


  const invoiceRef = useRef();

  const total = orderDetails.reduce((sum, item) => sum + item.serviceDetails.servicePrice * item.quantity, 0);
  const today = format(new Date(), 'yyyy-MM-dd');

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    html2canvas(invoiceRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
        pdf.save(`invoice_${order.orderId}.pdf`);
    });
    };
  return (
    <div className="invoice p-4 mt-5" ref={invoiceRef} style={{ width: '80%', margin: '0 auto', backgroundColor: '#fff' }}>
      <h2 className="text-center mb-4">Customer Invoice</h2>

      {studioDetails && <div className="mb-4">
        <strong>{studioDetails.name}</strong><br />
        Phone: {studioDetails.phone}<br />
        Address: {studioDetails.address}<br />
        Ordered Date: {new Date(orderDetails[0].createdAt).toLocaleString}
      </div>}

      <div className="mb-3">
        <strong>Order ID:</strong> ODRID{orderDetails[0].orderId}
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Item Name</th>
            <th>Price (LKR)</th>
            <th>Quantity</th>
            <th>Total (LKR)</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map((item, index) => (
            <tr key={index}>
              <td>{item.serviceDetails.serviceName}</td>
              <td>{item.serviceDetails.servicePrice}</td>
              <td>{item.quantity}</td>
              <td>{ (Number(item.serviceDetails.servicePrice) * Number(item.quantity)) }</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-end mb-3">
        <strong>Total Price: LKR {total}</strong>
      </div>

      <div className="mb-3">
        <strong>Payment Method:</strong> {paymentMethod}
      </div>

      <h5 className="mt-4">Delivery Details</h5>
      <div><strong>Name:</strong> {deliveryDetails.receiverName}</div>
      <div><strong>Phone:</strong> {deliveryDetails.receiverPhoneNumber}</div>
      <div><strong>Address:</strong> {deliveryDetails.receiverStreet}, {deliveryDetails.receiverCity}, {deliveryDetails.receiverDistrict}</div>

      {/* Print & Download Buttons */}
      <div className="mt-4 text-center d-flex ">
        <button className="btn btn-success m-3" onClick={handleDownload}>Download Invoice</button>
        <button className="btn btn-primary m-3" onClick={handlePrint}>Print Invoice</button>
      </div>
    </div>
  );
};

export default Invoice;
