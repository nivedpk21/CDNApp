const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const ipModel = require("./src/models/ipModel");
const urlModel = require("./src/models/urlModel");
const PORT = 4000;

app.use(bodyparser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/live", (req, res) => {
  res.send("hello world!");
});
//nice

app.get("/get-ip", async (req, res) => {
  try {
    const userIp = "1200"; //req.ip;
    let existingIp = await ipModel.findOne({ ip: userIp });

    if (!existingIp) {
      console.log("freship");
      // fresh ip
      const newData = {
        ip: userIp,
        count: "1",
      };
      const saveData = await ipModel(newData).save();
      if (saveData) {
        const responseUrl = await urlModel.findOne({ order: "1" });
        if (responseUrl) {
          return res.status(200).json({
            data: responseUrl.url,
            message: "url fetched successfully",
          });
        } else {
          return res.status(400).json({ message: "unable fetch url" });
        }
      } else {
        return res.status(400).json({ message: "unable to save ip" });
      }
    } else {
      // already existing ip
      let nextOrder;
      if (existingIp.count === "1") {
        existingIp.count = "2";
        nextOrder = 2;
      } else if (existingIp.count === "2") {
        existingIp.count = "3";
        nextOrder = 3;
      } else {
        return res.status(400).json({ message: "reached maximum limit" });
      }

      await existingIp.save();
      const returnUrl = await urlModel.findOne({ order: nextOrder });
      if (returnUrl) {
        return res.status(200).json({
          data: returnUrl.url,
          message: "url fetched successfully",
        });
      } else {
        return res.status(400).json({
          message: "unable to fetch url",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

//add urls

app.post("/add-url", async (req, res) => {
  try {
    const urlData = {
      url: req.body.url,
      order: req.body.order,
    };

    const existingOrder = await urlModel.findOne({ order: urlData.order });
    if (existingOrder) {
      return res.status(400).json({
        message: "order number already assigned",
        sucess: false,
        error: true,
      });
    }

    const saveurl = await urlModel(urlData).save();
    if (saveurl) {
      return res.status(200).json({
        message: "url added successfully",
      });
    } else {
      return res.status(400).json({
        message: "unable to add url",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log("server started");
});
