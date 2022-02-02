const router = require('express').Router();
const User = require('../model/User');
const Excercise = require('../model/Excercise');

router.get('/', async (req, res) => {
  const users = await User.find();

  res.json(users);
});
router.post('/', async (req, res) => {
  console.log(req.body);
  const user = await User.create(req.body);
  const { _id, username } = user;

  res.json({ _id, username });
});
router.post('/:_id/exercises', async (req, res) => {
  const id = req.params._id;
  const user = await User.findById(id);
  if (!user) {
    return res.send('Unknown userId');
  }
  const date = req.body.date
    ? new Date(req.body.date).toDateString()
    : new Date().toDateString();
  const exc = await Excercise.create({
    username: user.username,
    description: req.body.description,
    duration: req.body.duration,
    date,
  });
  const { username, description, duration, date: dt } = exc;

  res.json({ _id: user._id, username, description, duration, date: dt });
});

router.get('/:_id/logs', async (req, res) => {
  const user = await User.findById(req.params._id);
  if (!user) {
    return res.send('User not found');
  }
  const excs = await Excercise.find({ username: user.username });
  return res.json({
    _id: user._id,
    username: user.username,
    count: excs.length,
    log: excs.map(ex => ({
      description: ex.description,
      duration: ex.duration,
      date: ex.date,
    })),
  });
});

module.exports = router;
