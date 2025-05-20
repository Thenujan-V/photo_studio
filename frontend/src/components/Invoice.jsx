import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { storeInvoiceToDB } from '../Services/invoiceService';
import { triggerNotification } from '../Services/notificationService';
import '../style/Invoice.scss'

const Invoice = ({ details }) => {
    console.log(details)
    const { orderDetails, paymentMethod, deliveryDetails} = details

    const studioDetails = {
        name: "JUNIORPIX",
        phone: "011-2345678",
        address: "123 Main Street, Colombo 07"
      }
    const hasUploadedRef = useRef(false)

    useEffect(() => {
      if (!invoiceRef.current || !orderDetails || orderDetails.length === 0) return;

      html2canvas(invoiceRef.current).then( async (canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

        const pdfBlob = pdf.output('blob');

        const formData = new FormData();
        formData.append('invoice', pdfBlob, `invoice_${orderDetails[0].orderId}.pdf`);

        try{
          const storeInvoiceResult = await storeInvoiceToDB(orderDetails[0].orderId, formData)
          console.log("store invoice : ", storeInvoiceResult)
          if(storeInvoiceResult.status === 201){
            triggerNotification("Successfully save invoice into DB.", "Success")
            hasUploadedRef.current = true
          }
        }catch(err){
          console.log("error when store invoice: ", err)
        }
      });
    }, [orderDetails])

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
          pdf.save(`invoice_${orderDetails[0].orderId}.pdf`);
      });
    };
  return (
    <div className="invoice p-4 mt-5" ref={invoiceRef} style={{ width: '80%', margin: '0 auto', backgroundColor: '#fff' }}>
      <h2 className="text-center mb-4">Customer Invoice</h2>

      {studioDetails && <div className="studio-details mb-4">
        <strong>{studioDetails.name}</strong><br />
        Phone: {studioDetails.phone}<br />
        Address: {studioDetails.address}<br />
        Ordered Date: {new Date(orderDetails[0].createdAt).toLocaleString}
      </div>}

      <div className="order-id mb-3">
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

      <div className="total-price  text-end mb-3">
        <strong>Total Price: LKR {total}</strong>
      </div>

      <div className="payment-method mb-3">
        <strong>Payment Method:</strong> {paymentMethod}
      </div>

      <h5 className="delivery-details mt-4">Delivery Details</h5>
      <div><strong>Name:</strong> {deliveryDetails.receiverName}</div>
      <div><strong>Phone:</strong> {deliveryDetails.receiverPhoneNumber}</div>
      <div><strong>Address:</strong> {deliveryDetails.receiverStreet}, {deliveryDetails.receiverCity}, {deliveryDetails.receiverDistrict}</div>

      {/* Print & Download Buttons */}
      <div className="action-buttons mt-4 text-center d-flex ">
        <button className="btn btn-success m-3" onClick={handleDownload}>Download Invoice</button>
        <button className="btn btn-primary m-3" onClick={handlePrint}>Print Invoice</button>
      </div>
    </div>
  );
};

export default Invoice;
