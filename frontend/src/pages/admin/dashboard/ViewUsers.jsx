import { all } from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { deleteAccount, showAllUsers } from '../../../Services/userService';
import { triggerNotification } from '../../../Services/notificationService';


const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAllUsers = async () => {
            const allUsers = await showAllUsers()
            setUsers(allUsers.details)
        }

        fetchAllUsers()
    }, [])

  const deleteUser = async (id) => {
    window.confirm("Are you sure? This user will be deleted permanently!")
    try{
        const deleteUser = await deleteAccount(id)
        console.log("dui :", deleteUser)
        if(deleteUser.status === 200){
            triggerNotification("Successfully Delete User.", "Success")
            const updatedUsers = users.filter(user => user.id !== id);
        	setUsers(updatedUsers);
        }else{
            triggerNotification("Failed to Delete User.", "error")
        }
    }catch(err){
        console.log("error occured when delete user.", err)
    }
    
  };

  const handleSendMessage = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSendEmail = () => {
    alert(`Email sent to ${selectedUser.email}:\n\n${message}`);
    setShowModal(false);
    setMessage('');
  };

  return (
     <div className="container mt-1">
      <h2 className="text-center fw-bolder fs-1 mb-4">User Management</h2>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>City</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(user => user.is_active === 1 )
            .map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.mail}</td>
              <td>{user.phone_number}</td>
              <td>{user.city}</td>
              <td>{user.created_at}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  className="me-2"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSendMessage(user)}
                >
                  Send Message
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for sending email */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Message to {selectedUser?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>To</Form.Label>
              <Form.Control
                rows={4}
                value={selectedUser?.mail}
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
          <Button variant="success" onClick={handleSendEmail}>Send</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ViewUsers