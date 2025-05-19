import React, { useEffect, useState } from "react";
import { triggerNotification } from "../../../Services/notificationService";
import { decodedToken } from "../../../Services/getToken ";
import "../../../style/ChangePassword.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { changePassword, userDetails } from "../../../Services/userService";
import { generateOTP } from "../../../Services/otpService";
import { sendMailToClient } from "../../../Services/mailService";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [userMail, setUserMail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");

  const decoded = decodedToken();
  const userId = decoded.userId;

  useEffect(() => {
    const fecthUserMail = async () => {
      const result = await userDetails(userId);
      setUserMail(result.existingClient[0].mail);
    };
    fecthUserMail();
  }, [userId]);

  const validationsForFields = () => {
    if (!oldPassword || !newPassword || !confirmpassword) {
      triggerNotification("fill the all input fields. ", "error");
      return;
    }
    if (newPassword === oldPassword) {
      triggerNotification(
        "New password and old passwords are same set different password.",
        "error"
      );
      return;
    }
    if (newPassword.length < 6) {
      triggerNotification("password must contain minimun 6 letters.", "error");
      return;
    }
    if (newPassword !== confirmpassword) {
      triggerNotification("passwords not match.", "error");
      return;
    }
  };

  const handlePasswordChange = async () => {
    validationsForFields();
    try {
      const otpForSendClient = await generateOTP();
      await sendMailToClient(otpForSendClient);

      setOtpSent(true);
      setShowModal(true);
      triggerNotification("OTP sent to your email", "success");
    } catch (err) {
      triggerNotification("Failed to send OTP", "error");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      handleVerifyOtp();
      const field = { oldPW: oldPassword, newPw: newPassword };
      await changePassword(userId, field)
        .then((res) => {
          triggerNotification("Successfully update password", "success");
        })
        .catch((err) => console.log("error when update mail.", err));

      triggerNotification("Password changed successfully!", "success");
      setShowModal(false);
      setOtp("");
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
        triggerNotification("OTP verified! Your password reset now.", "success");
  
        localStorage.removeItem("otp");
        localStorage.removeItem("otp_expires");
      } else {
        triggerNotification("Incorrect OTP. Try again.", "error");
        return;
      }
    };


  return (
    <>
      <div className="edit-section">
        <h3>Change Password</h3>
        <p>
          You can update your password here to help keep your account secure.
          Please enter your current password and choose a new one. Make sure
          your new password is easy for you to remember but hard for others to
          guess. When you click the submit button, an OTP will be sent to your
          email. Enter the OTP to confirm your identity and reset your password.
        </p>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button onClick={handlePasswordChange}>Change Password</button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            To proceed with changing your password, please enter the OTP sent to
            your registered email address: <strong>{userMail}</strong>. This
            One-Time Password helps verify your identity and ensure your account
            stays secure. Check your inbox (and spam folder), and once you've
            entered the OTP, click "Verify & Change" to continue with updating
            your password.
          </p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
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

export default ChangePassword;
