import express from "express";

const app = express();
app.use(express.json());

const cuddles = {}; 
// cuddles[sender] = { target, startTime }

app.post("/cuddle", (req, res) => {
  const { sender, target } = req.body;

  if (cuddles[sender]) {
    return res.json({
      message: `${sender} is already cuddling ${cuddles[sender].target}`
    });
  }

  cuddles[sender] = {
    target,
    startTime: Date.now()
  };

  res.json({
    message: `${sender} is now cuddling ${target} 💕`
  });
});

app.post("/uncuddle", (req, res) => {
  const { sender, target } = req.body;
  const cuddle = cuddles[sender];

  if (!cuddle || cuddle.target !== target) {
    return res.json({
      message: `${sender} is not cuddling ${target}`
    });
  }

  const duration = Date.now() - cuddle.startTime;
  delete cuddles[sender];

  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);

  res.json({
    message: `${sender} is done cuddling ${target} and have been cuddling for ${minutes}m ${seconds % 60}s`
  });
});

app.get("/", (req, res) => res.send("Cuddle API running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT);
