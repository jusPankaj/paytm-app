const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");
// const bodyParser = require("body-parser");
const app = express();
const port = 3000;


app.use(cors());
app.use('/api/v1',rootRouter);
// app.use(bodyParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Paytm");
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`server is up and running on port ${port}`);
});
