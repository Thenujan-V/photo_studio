const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const axios = require("axios");
const PORT = process.env.PORT;

const createOrder = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { cartItems } = req.body;
    console.log("ci :", cartItems);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not valid." });
    }

    const orderResult = await orderModel.createOrder(clientId);
    const orderId = orderResult.insertId;

    const resultForDetails = [];

    for (const item of cartItems) {
      const { cartId, serviceCategoryId, serviceId, quantity } = item;
      const result = await orderModel.createOrderDetails({
        orderId: orderId,
        serviceCategoryId,
        serviceId,
        quantity,
      });
      resultForDetails.push(result);
    }
    await cartModel.cartDeleteByClientId(clientId);

    res.status(201).json({
      message: "Successfully created.",
      order_id: orderId,
      orderDetails: resultForDetails,
    });
  } catch (err) {
    console.log("Error when save client.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to create order.",
    });
  }
};

const addPhotosForOrders = async (req, res) => {
  try {
    const { orderDetailsId } = req.params;
    const { clientMessage } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one photo is required." });
    }
    const file_paths = files.map((file) => file.filename);

    const addPhotosResult = await orderModel.addClientsPhotosForOrders({
      file_paths,
      clientMessage,
      orderDetailsId,
    });

    res
      .status(201)
      .json({ message: "successfully photos added.", addPhotosResult });
  } catch (err) {
    console.log("Error when save client.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to create client.",
    });
  }
};

const addEditedPhotos = async (req, res) => {
  try {
    const { orderDetailsId } = req.params;
    const files = req.files;

    const existingRow = await orderModel.getEditedPhoto(orderDetailsId)
    console.log("er :", existingRow)

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one photo is required." });
    }

    const file_paths = files.map((file) => file.filename);
    const reqBody = { status: "awaiting_approval" };
    const addPhotosResult = existingRow.length === 0 ? await orderModel.addEditedPhotosForOrders({
      file_paths,
      orderDetailsId,
    }) : orderModel.updateEditedPhotosForOrders({ file_paths, orderDetailsId})

    await axios
      .patch(
        `http://localhost:${PORT}/api/orders/change-status/${orderDetailsId}`,
        reqBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          return res
            .status(201)
            .json({ message: "successfully photos added.", addPhotosResult });
        } else {
            console.log("2")

          return res
            .status(500)
            .json({ message: "Error when change status"});
        }
      })
      .catch((err) => {
            console.log("3")

        return res
          .status(500)
          .json({ message: "Error when change status", err });
      });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error. Faild to add photos.",
    });
  }
};

const getOrdersByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    const getOrderDetails = await orderModel.orderFetchByClientId(clientId);
    // const getOrderDetails = res.data
    // console.log("res :", res)
    // console.log("get :", getOrderDetails)
    const serviceDetails = getOrderDetails.map(async (item) => {
      const fetchServiceDetails = await axios.get(
        `http://localhost:${PORT}/api/services/fetch-services/${item.serviceCategoryId}/${item.serviceId}`
      );
      return {
        ...item,
        serviceCategory:
          fetchServiceDetails.data.servicesDetails.serviceCategory,
        serviceDetails: fetchServiceDetails.data.servicesDetails.services[0],
      };
    });
    const enrichedOrderDetails = await Promise.all(serviceDetails);

    res
      .status(200)
      .json({ message: "successfully fetched.", enrichedOrderDetails });
  } catch (err) {
    console.log("Error when save client.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to create client.",
    });
  }
};

const fetchAllOrderDetails = async (req, res) => {
  try {
    const getAllOrderDetails = await orderModel.fetchAllOrderDetails();
    const serviceDetails = getAllOrderDetails.map(async (item) => {
      const fetchAllServiceDetails = await axios.get(
        `http://localhost:${PORT}/api/services/fetch-services/${item.serviceCategoryId}/${item.serviceId}`
      );
      return {
        ...item,
        serviceCategory:
          fetchAllServiceDetails.data.servicesDetails.serviceCategory,
        serviceDetails: fetchAllServiceDetails.data.servicesDetails.services[0],
      };
    });
    const enrichedAllOrderDetails = await Promise.all(serviceDetails);
    res.status(201).json({
      message: "Successfully fetched all order details.",
      enrichedAllOrderDetails,
    });
  } catch (err) {
    console.log("Error when fetch all details.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to create client.",
    });
  }
};

const createOrderDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;

    const {
      senderPhoneNumber,
      receiverName,
      receiverPhoneNumber,
      receiverDistrict,
      receiverCity,
      receiverStreet,
    } = req.body;
    const deliveryDetails = await orderModel.deliveryDetailsCreate(
      {
        senderPhoneNumber,
        receiverName,
        receiverPhoneNumber,
        receiverDistrict,
        receiverCity,
        receiverStreet,
      },
      orderId
    );

    res.status(201).json({
      message: "Successfully created.",
      id: deliveryDetails.insertId,
    });
  } catch (err) {
    console.log("Error when save client.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to create client.",
    });
  }
};

const fetchDeliveryDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deliveryResult = await orderModel.fetchDetailsForDelivery(orderId);

    if (deliveryResult.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no delivery details in this id." });
    }

    res.status(200).json({ message: "successfully fetched.", deliveryResult });
  } catch (err) {
    console.log("Error when save client.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to create client.",
    });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { orderDetailsId } = req.params;
    const { status } = req.body;

    const validStatus = [
      "processing",
      "editing",
      "awaiting_approval",
      "reediting",
      "approved",
      "in_production",
      "ready_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const orderDetailsResult = await orderModel.fetchOrderDeailsById(
      orderDetailsId
    );

    if (orderDetailsResult.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no order details in this id." });
    }

    const editResult = await orderModel.editStatus(status, orderDetailsId);

    return res
      .status(200)
      .json({ message: "successfully fetched.", editResult });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error. Faild to chanage status.",
    });
  }
};

const viewEditedPhoto = async (req, res) => {
  try {
    const { orderDetailsId } = req.params;
    if (!orderDetailsId) {
      return res.status(400).json({ message: "Bad request." });
    }

    const fetchEditedPhoto = await orderModel.getEditedPhoto(orderDetailsId);
    res
      .status(200)
      .json({ message: "Succesfully fetch data.", fetchEditedPhoto });
  } catch (err) {
    console.log("Error when save client.", err);
    return res.status(500).json({
      message: "Internal server error. Faild to create client.",
    });
  }
};
module.exports = {
  createOrder,
  addPhotosForOrders,
  getOrdersByClientId,
  createOrderDelivery,
  fetchDeliveryDetails,
  changeStatus,
  fetchAllOrderDetails,
  addEditedPhotos,
  viewEditedPhoto,
};
