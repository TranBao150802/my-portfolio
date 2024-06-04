require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const serverless = require('serverless-http');

const app = express();
const PORT = process.env.PORT || 3000;
const {join} = require("path");

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// app configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Đường dẫn tới views và public
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Sử dụng path.join để định vị đúng các tệp JSON
const navLinks = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/navItems.json')));
const projects = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/my-projects.json')));

app.get('/', (req, res) => {
    const personalInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/info.json')));
    const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categories.json')));

    res.render('index', { personalInfo, navLinks, categories, projects, formatDate });
});

app.get('/project/:id', (req, res) => {
    const project = projects.find(p => p.id === Number(req.params.id));
    res.render('project-detail', { navLinks, project, formatDate });
});

// app.listen(PORT, () => {});

module.exports.handler = serverless(app);
