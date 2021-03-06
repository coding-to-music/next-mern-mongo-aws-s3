const nodemailer = require('nodemailer');
const express = require('express');
const {
  verifySubscriberTokenMiddleware,
  verifyTokenMiddleware
} = require('../middleware/auth');
const Newsletter = require('../models/newsletter');
const httpStatus = require('http-status');
const utils = require('../utils/utils');
const e = require('express');

const router = express.Router();

router.post('/email', [verifyTokenMiddleware], (req, res) => {
  const { email, subject, content } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'headstoneofficial@gmail.com',
      pass: 'nefbczlwhhchoahe'
    }
  });

  const mailOptions = {
    from: 'weboom.info.websites@gmail.com', // TODO: email sender
    to: email, // TODO: email receiver
    subject,
    html: content
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).json(err);
    }
    res.status(200).json(data);
  });
});
router.post('/email/client', [verifySubscriberTokenMiddleware], (req, res) => {
  const { email, subject, content } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'headstoneofficial@gmail.com',
      pass: 'nefbczlwhhchoahe'
    }
  });

  const mailOptions = {
    from: 'weboom.info.websites@gmail.com', // TODO: email sender
    to: email, // TODO: email receiver
    subject,
    html: content
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).json(err);
    }
    res.status(200).json(data);
  });
});

router.post('/newsletter', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'sovrakofanela.shop@gmail.com', // TODO: email sender
    to: req.body.email, // TODO: email receiver
    subject: 'Sovrakofanela - ???????? 10% ??????????????',
    html: { path: 'email/newsletter.html' }
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).json(err);
    }
    const newNewsletter = new Newsletter({ email: req.body.email });
    newNewsletter.save((err, doc) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(doc);
      }
    });
  });
});

router.get('/newsletter', [verifyTokenMiddleware], async (req, res) => {
  const { orderby, filter, skip, sort, perPage } = req.query;
  try {
    const aggregate = Newsletter.aggregate();
    const match = { $and: [] };

    if (filter) {
      await filter.split(' ').forEach((f) => {
        match.$and.push({
          $or: [
            {
              email: {
                $regex: new RegExp(utils.transliterate(f), 'i')
              }
            }
          ]
        });
      });
      aggregate.match(match);
    }

    const options = {
      allowDiskUse: true,
      limit: perPage,
      page: skip,
      sortBy: { [orderby]: sort }
    };

    return Newsletter.aggregatePaginate(
      aggregate,
      options,
      (err, results, pageCount, count) => {
        if (err) {
          console.log(err);
          res.status(httpStatus.INTERNAL_SERVER_ERROR);
          return res.json();
        }
        res.status(httpStatus.OK);
        return res.json({
          count,
          newsletters: results,
          pageCount,
          skip
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json();
  }
});
router.get('/newsletter/client', [verifySubscriberTokenMiddleware], async (req, res) => {
  const { orderby, filter, skip, sort, perPage } = req.query;
  try {
    const aggregate = Newsletter.aggregate();
    const match = { $and: [] };

    if (filter) {
      await filter.split(' ').forEach((f) => {
        match.$and.push({
          $or: [
            {
              email: {
                $regex: new RegExp(utils.transliterate(f), 'i')
              }
            }
          ]
        });
      });
      aggregate.match(match);
    }

    const options = {
      allowDiskUse: true,
      limit: perPage,
      page: skip,
      sortBy: { [orderby]: sort }
    };

    return Newsletter.aggregatePaginate(
      aggregate,
      options,
      (err, results, pageCount, count) => {
        if (err) {
          console.log(err);
          res.status(httpStatus.INTERNAL_SERVER_ERROR);
          return res.json();
        }
        res.status(httpStatus.OK);
        return res.json({
          count,
          newsletters: results,
          pageCount,
          skip
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json();
  }
});

router.post('/register', [verifyTokenMiddleware], (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'headstoneofficial@gmail.com',
      pass: 'nefbczlwhhchoahe'
    }
  });

  const mailOptions = {
    from: 'weboom.info.websites@gmail.com', // TODO: email sender
    to: req.body.email, // TODO: email receiver
    subject: 'Pre-Vulture - ??????????????',
    html: { path: 'email/register.html' },
    context: {
      name: 'George Koutroulis'
    } // send extra values to template
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
});
router.post('/register/client', [verifySubscriberTokenMiddleware], (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'headstoneofficial@gmail.com',
      pass: 'nefbczlwhhchoahe'
    }
  });

  const mailOptions = {
    from: 'weboom.info.websites@gmail.com', // TODO: email sender
    to: req.body.email, // TODO: email receiver
    subject: 'Pre-Vulture - ??????????????',
    html: { path: 'email/register.html' },
    context: {
      name: 'George Koutroulis'
    } // send extra values to template
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
});

router.post('/support-chat', [verifySubscriberTokenMiddleware], (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'headstoneofficial@gmail.com',
      pass: 'nefbczlwhhchoahe'
    }
  });

  const mailOptions = {
    from: 'headstoneofficial@gmail.com', // TODO: email sender
    to: 'headstoneofficial@gmail.com', // TODO: email receiver
    subject: '???????? ?????????????? ?????????? ??????????????',
    html: `<a href='https://axios.co/dashboard/chat/room?name=George&room=${req.body.email}'>???????? ?????? ??????????????: ${req.body.email}</a>`,
    context: {
      name: 'George Koutroulis'
    } // send extra values to template
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).json(err);
    }
    res.status(200).json(data);
  });
});

router.post('/contact', [verifyTokenMiddleware], (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'headstoneofficial@gmail.com',
      pass: 'nefbczlwhhchoahe'
    }
  });

  const mailOptions = {
    from: 'headstoneofficial@gmail.com', // TODO: email sender
    to: 'headstoneofficial@gmail.com', // TODO: email receiver
    subject: `Pre-Vulture - ?? ${req.body.name} ?????? ?????????????? ????????????`,
    html: `${req.body.email} - </br> ${req.body.message}`
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).json(err);
    }
    res.status(200).json(data);
  });
});
router.post('/contact/client', [verifySubscriberTokenMiddleware], (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'headstoneofficial@gmail.com',
      pass: 'nefbczlwhhchoahe'
    }
  });

  const mailOptions = {
    from: 'headstoneofficial@gmail.com', // TODO: email sender
    to: 'headstoneofficial@gmail.com', // TODO: email receiver
    subject: `Pre-Vulture - ?? ${req.body.name} ?????? ?????????????? ????????????`,
    html: `${req.body.email} - </br> ${req.body.message}`
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).json(err);
    }
    res.status(200).json(data);
  });
});

module.exports = router;
