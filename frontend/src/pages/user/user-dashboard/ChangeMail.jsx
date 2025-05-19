import React, { useEffect, useState } from "react";
import "../../../style/ChangePassword.scss";
import { decodedToken } from "../../../Services/getToken ";
import { updateUserProfile, userDetails } from "../../../Services/userService";
import { triggerNotification } from "../../../Services/notificationService";
import "reactjs-popup/dist/index.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { generateOTP } from "../../../Services/otpService";
import { sendMailToClient } from "../../../Services/mailService";

const ChangeMail = () => {
  const [newEmail, setNewEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  

  const [enteredOtp, setEnteredOtp] = useState("");

  const decoded = decodedToken();
  const userId = decoded.userId;

  useEffect(() => {
    const fecthUserMail = async () => {
      const result = await userDetails(userId);
      setOldEmail(result.existingClient[0].mail);
    };
    fecthUserMail();
  }, [userId]);

  const validation = () => {
    if (!newEmail) {
      triggerNotification("Please Enter the New Email.", "error");
      return;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(newEmail)
    ) {
      triggerNotification("Invalid email address", "error");
      return;
    }
  };

  const handleEmailChange = async () => {
    validation();
    try {
      const otpForSendClient = await generateOTP();
      await sendOtpToClient(otpForSendClient);

      setOtpSent(true);
      setShowModal(true);
      triggerNotification("OTP sent to your new email", "success");
    } catch (error) {
      triggerNotification("Failed to send OTP", "error");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      handleVerifyOtp();
      const field = { mail: newEmail };
      await updateUserProfile(field, userId)
        .then((res) => {
          triggerNotification("Successfully update mail", "success");
        })
        .catch((err) => console.log("error when update mail.", err));

      triggerNotification("Email changed successfully!", "success");
      setShowModal(false);
      setOtp("");
      setNewEmail("");
    } catch (error) {
      triggerNotification("Invalid OTP or email change failed.", "error");
    }
  };

  const handleVerifyOtp = () => {
    const storedOtp = localStorage.getItem("otp");
    const storedExpires = parseInt(
      localStorage.getItem("otp_expires") || "0",
      10
    );

    if (Date.now() > storedExpires) {
      triggerNotification(
        "OTP has expired. Please request a new one.",
        "error"
      );
      localStorage.removeItem("otp");
      localStorage.removeItem("otp_expires");
      return;
    }

    if (enteredOtp === storedOtp) {
      triggerNotification("OTP verified! Your mail reset now.", "success");

      localStorage.removeItem("otp");
      localStorage.removeItem("otp_expires");
    } else {
      triggerNotification("Incorrect OTP. Try again.", "error");
      return;
    }
  };

  const sendOtpToClient = async (otpForClient) => {
    const mailData = {
      to: newEmail,
      subject: "Account mail update confirmation",
      message: `We received a request to reset your account password. 
                Please use the OTP (One-Time Password) below to proceed. This OTP is valid for 5 minutes.
                 \n\ Your one time password is: ${otpForClient} `,
    };

    await sendMailToClient(mailData)
    .then(res => console.log(res))
    .catch(err => console.log("error when send mail.", err))
  };
  return (
    <>
      <div className="edit-section">
        <h3>Change Email</h3>
        <p>
          You can update your email address here to ensure we have your most
          current contact information. Enter your new email address and click
          the submit button. An OTP will be sent to your new email for
          verification. Please enter the OTP to confirm the change and update
          your account.
        </p>
        <label>Old Email</label>
        <input type="email" value={oldEmail} readOnly />
        <label>New Email</label>
        <input
          type="email"
          placeholder="New Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <button onClick={handleEmailChange}>Change Email</button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            To confirm your email change, please enter the OTP sent to your new
            email address: <strong>{newEmail}</strong>. This One-Time Password
            is required to verify your identity and confirm the update. Check
            your inbox (and spam folder). Once you’ve entered the OTP, click{" "}
            <strong>"Verify & Change"</strong> to complete the email update.
          </p>
          <input
            type="text"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            placeholder="Enter OTP"
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleOtpSubmit}>
            Verify & Change
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChangeMail;
