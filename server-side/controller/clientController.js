const clientModel = require("../models/clientModel");
const roleModel = require("../models/roleModel");
const encoder = require("../utils/password");
const tokenUtil = require("../utils/jwtToken");

const registerClient = async (req, res) => {
  try {
    const { username, mail, phone_number, city, password } = req.body;

    const checkExistingUserName = await clientModel.findByUserName(username);
    const checkExistingMail = await clientModel.findByMail(mail);
    const checkExistingPhoneNumber = await clientModel.findByPhoneNo(
      phone_number
    );

    if (checkExistingUserName.length > 0) {
      return res
        .status(409)
        .json({ message: "user name already exist.", key: "username" });
    }
    if (checkExistingMail.length > 0) {
      return res
        .status(409)
        .json({ message: "mail already exist.", key: "mail" });
    }
    if (checkExistingPhoneNumber.length > 0) {
      return res
        .status(409)
        .json({ message: "phone number already exist.", key: "phoneno" });
    }

    const hashedPassword = await encoder.hashPassword(password);

    const role_id = await roleModel.getRoleIdByname("USER");

    const result = await clientModel.clientRegister(
      {
        username,
        mail,
        phone_number,
        city,
        password: hashedPassword,
      },
      role_id.id
    );
    console.log("response from register: ", res);
    return res.status(201).json({
      message: "Client saved successfully.",
      clientId: result.insertId,
    });
  } catch (err) {
    console.log("Error when save client.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to create client.",
    });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { admin_name, mail, phone_number, street, city, password } = req.body;

    const hashedPassword = await encoder.hashPassword(password);

    const role_id = await roleModel.getRoleIdByname("ADMIN");

    const result = await clientModel.adminRegister(
      {
        admin_name,
        mail,
        phone_number,
        street,
        city,
        password: hashedPassword,
      },
      role_id.id
    );

    return res.status(201).json({
      message: "Admin saved successfully.",
      adminId: result.insertId,
    });
  } catch (err) {
    console.log("Error when save admin.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to create client.",
    });
  }
};

const loginClient = async (req, res) => {
  try {
    const { mail, password } = req.body;
    const existingUser = await clientModel.findByMail(mail);

    if (existingUser.length === 0) {
      const existingAdmin = await clientModel.findAdminByMail(mail);
      if (existingAdmin.length === 0)
        return res
          .status(400)
          .json({ message: "Invalid username or password." });

      const isPasswordMatch = await encoder.comparePassword(
        password,
        existingAdmin[0].password
      );

      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: "Invalid username or password." });
      }

      const role = await roleModel.getRoleById(existingAdmin[0].role_id);
      const token = await tokenUtil.jwttoken({
        id: existingAdmin[0].id,
        username: existingAdmin[0].username,
        role: role.role,
      });

      return res.status(200).json({ message: "login successful.", role: 'ADMIN', token });
    }

    const isPasswordMatch = await encoder.comparePassword(
      password,
      existingUser[0].password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const role = await roleModel.getRoleById(existingUser[0].role_id);
    const token = await tokenUtil.jwttoken({
      id: existingUser[0].id,
      username: existingUser[0].username,
      role: role.role,
    });

    return res.status(200).json({ message: "login successful.", role: 'USER', token });
  } catch (err) {
    console.log("Error when client login.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to signin client.",
    });
  }
};

const getClientDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const existingClient = await clientModel.findByClientId(id);

    if (existingClient.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no client in this id." });
    }
    return res
      .status(200)
      .json({ message: "successfully get client details.", existingClient });
  } catch (err) {
    console.log("Error when getting client details.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to signin client.",
    });
  }
};

const getAllClientDetails = async (req, res) => {
  try {
    const details = await clientModel.findAll();

    if (details.length === 0) {
      return res.status(204).json({ message: "There is no data." });
    }
    return res
      .status(200)
      .json({ message: "Successfully fetch datas.", details });
  } catch (err) {
    console.log("Error when get client details.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to signin client.",
    });
  }
};

const editClientDetails = async (req, res) => {
  try {
    const { username, mail, phone_number, city } = req.body;
    const { id } = req.params;
    console.log(req.body);
    updatedFields = {};

    if (username) {
      const existingUser = await clientModel.findByUserName(username);

      if (existingUser.length > 0) {
        return res.status(409).json({ message: "user name already exist" });
      }

      updatedFields.username = username;
    }
    if (mail) {
      const checkExistingMail = await clientModel.findByMail(mail);

      if (checkExistingMail.length > 0) {
        return res.status(409).json({ message: "user mail already exist." });
      }

      updatedFields.mail = mail;
    }
    if (phone_number) {
      const checkExistingPhoneNo = await clientModel.findByPhoneNo(
        phone_number
      );

      if (checkExistingPhoneNo.length > 0) {
        return res.status(409).json({ message: "phone number already exist." });
      }

      updatedFields.phone_number = phone_number;
    }
    if (city) updatedFields.city = city;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No fields provide." });
    }

    const existingClient = await clientModel.findByClientId(id);

    if (existingClient.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no client in this client ID." });
    }

    const result = await clientModel.clientEdit(id, updatedFields);

    return res
      .status(200)
      .json({ message: "successfully edited.", data: result });
  } catch (err) {
    console.log("Error when client edit.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to edit client.",
    });
  }
};

const deleteClient = (req, res) => {
  const { id } = req.params;

  try {
    const existingClients = clientModel.findByClientId(id);

    if (existingClients.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no client in this client ID." });
    }

    const result = clientModel.clientDelete(id);
    return res.status(200).json({ message: "successfully deleted.", result });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error. Faild to edit client.",
    });
  }
};

const passwordUpdate = async (req, res) => {
  const {oldPW, newPW} = req.body
  const {id} = req.params

  try{
    const existingClients = clientModel.findByClientId(id);

    if (existingClients.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no client in this client ID." });
    }

    const isPasswordMatch = await encoder.comparePassword(
      oldPW,
      existingClients[0].password
    );
    if(!isPasswordMatch){
      return res.status(400).json({ message: "passwords not match."});
    }
    const result = clientModel.changePassword(id, newPW)
    return res.status(200).json({ message: "successfully deleted.", result });

  }catch(err){
    return res.status(500).json({
      message: "Internal server error. Faild to update password.",
    });
  }



}

module.exports = {
  registerClient,
  loginClient,
  getClientDetails,
  getAllClientDetails,
  editClientDetails,
  deleteClient,
  registerAdmin,
  passwordUpdate
};
