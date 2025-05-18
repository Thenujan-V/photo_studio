import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { getInquiry } from "../../../Services/inquiryService";
import { all } from "axios";
import { triggerNotification } from "../../../Services/notificationService";
import { sendMailToClient } from "../../../Services/mailService";

const Inquiry = () => {
  const [inquiry, setInquiry] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllInquiry = async () => {
      const allInquiry = await getInquiry();
      setInquiry(allInquiry.data.fetchInquiryResult);
      console.log("ins : ", allInquiry.data.fetchInquiryResult);
    };

    fetchAllInquiry();
  }, []);

  const handleSendMessage = (user) => {
    setSelectedItem(user);
    setShowModal(true);
  };

  const handleSendEmail = async (to, subject, msg) => {
    const mailData = { to: to, subject: subject, message: msg };

    alert(`Email sent to ${to}:\n${msg}`);
    const sendMail = await sendMailToClient(mailData);
    if (sendMail.status === 200) {
      triggerNotification("message send successfully.", "success");
    }
    setShowModal(false);
    setMessage("");
  };

  return (
    <div className="container mt-1">
      <h2 className="text-center fw-bolder fs-1 mb-4">Inquiry Management</h2>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Inquiry Msg</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inquiry.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.user_name}</td>
              <td>{item.mail}</td>
              <td>{item.inquiry_msg}</td>
              <td>{item.created_at}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSendMessage(item)}
                >
                  Reply
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for sending email */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Message to {selectedItem?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>To</Form.Label>
              <Form.Control
                rows={4}
                value={selectedItem?.mail}
                readOnly
                style={{ height: "40px" }}
              />
              <Form.Label style={{ marginTop: "10px" }}>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={() =>
              handleSendEmail(
                selectedItem?.mail,
                "Reply for your inquiry.",
                message
              )
            }
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Inquiry;
