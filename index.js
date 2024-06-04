require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
const navLinks = JSON.parse(fs.readFileSync('./data/navItems.json'));
const projects = JSON.parse(fs.readFileSync('./data/my-projects.json'));

app.get('/', (req, res) => {
    const personalInfo = JSON.parse(fs.readFileSync('./data/info.json'));
    const categories = JSON.parse(fs.readFileSync('./data/categories.json'));

    res.render('index', { personalInfo, navLinks, categories, projects, formatDate });
});

app.get('/project/:id', (req, res) => {
    const project = projects.find(p => p.id === Number(req.params.id));
    res.render('project-detail', { navLinks, project, formatDate });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
