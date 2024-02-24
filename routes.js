const { Router } = require("express");
const { channel } = require("./services");
const app = Router();

const generateCode = () => {
  const getRandomNumber = () => Math.floor(Math.random() * 900) + 100;
  const getRandomLetters = () => 
    String.fromCharCode(Math.floor(Math.random() * 26) + 97).toUpperCase() +
    String.fromCharCode(Math.floor(Math.random() * 26) + 97) +
    String.fromCharCode(Math.floor(Math.random() * 26) + 97);

  return `${getRandomNumber()}-${getRandomLetters()}`.toUpperCase();
};

const transformArray = (inputArray) => {
  return inputArray.filter(Boolean).map((item, index) => {
    return {
      name: item,
      code: generateCode()
    };
  });
};

const generateID = () => Math.floor(1000 + Math.random() * 9000);

app.post('/login', (req, res) => {
  res.status(200).send(req.body.password == process.env.PASSWORD);
});

app.post('/channel/create', async (req, res) => {
  try {
    let data = req.body
    data.id = generateID();
    data.responsible = transformArray(data.responsible);
    const result = await channel.create(data);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  };
});

app.get('/channel/get/:uid', async (req, res) => {
  try {
    const result = await channel.get(req.params.uid);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  };
});

app.get('/channel/getAll/', async (req, res) => {
  try {
    const result = await channel.getAll();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  };
});

app.get('/channel/team/:uid', async (req, res) => {
  try {
    const channelInfo = await channel.get(req.params.uid);
    const players = await channel.team(req.params.uid);
    res.status(200).send({ channelInfo, players });
  } catch (error) {
    res.status(500).send(error);
  };
});

app.post('/channel/add/player', async (req, res) => {
  try {
    let data = req.body;
    const result = await channel.player.add(data);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  };
});

app.get('/channel/player/:uid', async (req, res) => {
  try {
    const result = await channel.player.get(req.params.uid);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  };
});

app.delete('/channel/remove/player/:uid', async (req, res) => {
  try {
    const result = await channel.player.remove(req.params.uid);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  };
});

module.exports = app;