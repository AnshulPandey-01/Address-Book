const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Address = require('./model/models');

const app = express();

const PORT = process.env.PORT || 3002;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`sever listening on port: ${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/AddressBook', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log('connected to db');
}).catch((error) => {
    console.log(error);
});

app.use(express.json());

app.get('/show/', async(req, res) => {
    const query = { email: req.query.email };
    const user = await Address.find(query);
    res.send(user);
});

app.get('/register', async (req, res) => {
    let newAddress = new Address({
        name: req.query.name,
        email: req.query.email,
        phone: req.query.phone,
        place: req.query.place
    });
    try {
        const a = await newAddress.save();
        res.json(a);
    } catch (error) {
        console.log(error);
    }
});

app.get('/update/', (req, res) => {
    const query = { email: req.query.email };
    Address.exists(query, async (error, result) => {
        if (error) throw error;
        if (result) {
            let address = {};
            if (req.query.name) address.name = req.query.name;
            if (req.query.email) address.email = req.query.email;
            if (req.query.phone) address.phone = req.query.phone;
            if (req.query.place) address.place = req.query.place;
            address = { $set: address }
            Address.update({ email: req.query.email }, address).then(() => {
                res.send(address);
            }).catch((error) => {
                console.log(error);
            });
        }
    });
});

app.get('/delete/', async(req, res) => {
    const query = { email: req.query.email };
    const user = await Address.find(query);
    console.log(user[0]._id);
    await Address.findByIdAndDelete(user[0]._id).then(() => {
        res.send('user deleted');
    }).catch((error) => {
        console.log(error);
    });
});