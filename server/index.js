const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const ipModel = require("./src/models/ipModel");
const urlModel = require("./src/models/urlModel");
const proxyCheck = require("proxycheck-node.js");

app.use(bodyparser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/live", (req, res) => {
  res.send("hello world!");
});

app.get("/get-ip", async (req, res) => {
  const requestIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userIp = requestIP ? requestIP.split(",")[0].trim() : req.connection.remoteAddress;
  console.log(requestIP, "req IP");
  console.log(userIp, "userIP");
  testIP = "157.46.1.250";
  console.log(testIP, "tst");

  try {
    const check = new proxyCheck({ api_key: "989e88-762533-6f2h93-ny9541" });
    const result = await check.check(userIp);
    console.log(result, "result");

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
          // return res.redirect(responseUrl.url);
          return res.status(200).json({
            data: result,
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
        return res.redirect(returnUrl.url);
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

app.listen(4000, () => {
  console.log("server started");
});
