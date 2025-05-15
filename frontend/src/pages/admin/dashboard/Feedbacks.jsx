import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { sendReplyForFeedback, showAllFeedbacks } from '../../../Services/feedbackService';
import { all } from 'axios';
import { triggerNotification } from '../../../Services/notificationService';
import { sendMailToClient } from '../../../Services/mailService';

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedbacks, setSelectedFeedbacks] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAllFeedbacks = async () => {
            const allFeedbacks = await showAllFeedbacks ()
            setFeedbacks(allFeedbacks.data.feedbackResult)
        }

        fetchAllFeedbacks()
    }, [])

    const deleteFeedbacks = async (id) => {
        // window.confirm("Are you sure? This user will be deleted permanently!")
        // try{
        //     const deleteFeedbacks = await deleteAccount(id)
        //     console.log("dui :", deleteFeedbacks)
        //     if(deleteFeedbacks.status === 200){
        //         triggerNotification("Successfully Delete Feedbacks.", "Success")
        //         const updatedFeedbacks = feedbacks.filter(user => user.id !== id);
        //         setFeedbacks(updatedFeedbacks);
        //     }else{
        //         triggerNotification("Failed to Delete Feedbacks.", "error")
        //     }
        // }catch(err){
        //     console.log("error occured when delete user.", err)
        // }
    
    };

    const handleSendMessage = (user) => {
    setSelectedFeedbacks(user);
    setShowModal(true);
    };

    const handleSendEmail = async (to, subject, msg) => {
        const mailData = { to: to, subject: subject, message: msg}
    
        alert(`Email sent to ${to}:\n${msg}`);
        const sendMail = await sendMailToClient(mailData)
        if(sendMail.status === 200){
          triggerNotification("message send successfully.", "success")
        }
        setShowModal(false);
        setMessage('');
      };

      const handleSendReply = async (to, subject, msg, id) => {
        const addReplyForReview = await sendReplyForFeedback(id, msg)
        if(addReplyForReview === 200){
          await handleSendEmail(to, subject, msg)
        }
        else{
          triggerNotification("feedback reply failed.", "error")
        }
      }


  return (
     <div className="container mt-1">
      <h2 className="text-center fw-bolder fs-1 mb-4">Feedbacks Management</h2>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Client Name</th>
            <th>Feedback</th>
            <th>Rating</th>
            <th>Reply Msg</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks
            .map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.feedback}</td>
              <td>{user.rating}</td>
              <td>{user.reply_msg}</td>
              <td>{user.created_at}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  className="me-2"
                  onClick={() => deleteFeedbacks(user.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSendMessage(user)}
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
          <Modal.Title>Send Message to {selectedFeedbacks?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>To</Form.Label>
              <Form.Control
                rows={4}
                value={selectedFeedbacks?.mail}
                readOnly
                style={{ height: '40px' }}
              />
              <Form.Label>Feedback</Form.Label>
              <Form.Control
                rows={4}
                value={selectedFeedbacks?.feedback}
                readOnly
                style={{ height: '40px' }}
              />
              <Form.Label style={{marginTop: '10px'}}>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message here..."
                
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={() => handleSendReply(selectedFeedbacks?.mail, `Feedback response. your feedback - ${selectedFeedbacks?.feedback}`, message, selectedFeedbacks?.id)}>Send</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Feedbacks