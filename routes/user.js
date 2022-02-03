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
  const date = req.body.date && new Date(req.body.date);
  const exc = await Excercise.create({
    username: user.username,
    description: req.body.description,
    duration: req.body.duration,
    date,
  });
  const { username, description, duration, date: dt } = exc;

  res.json({
    _id: user._id,
    username,
    date: dt.toDateString(),
    duration,
    description,
  });
});

router.get('/:_id/logs', async (req, res) => {
  const user = await User.findById(req.params._id);
  if (!user) {
    return res.send('User not found');
  }
  const { from, to, limit } = req.query;
  let excs;
  if (from && to) {
    excs = await Excercise.find({ username: user.username })
      .where({ date: { $gte: from, $lt: to } })
      .limit(limit)
      .exec();
  } else {
    excs = await Excercise.find({ username: user.username })
      .limit(limit)
      .exec();
  }

  return res.json({
    username: user.username,
    count: excs.length,
    _id: user._id,
    log: excs.map(ex => ({
      description: ex.description,
      duration: ex.duration,
      date: ex.date.toDateString(),
    })),
  });
});

module.exports = router;
