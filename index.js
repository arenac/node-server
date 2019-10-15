const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
let numRequests = 0;

server.use((req, res, next) => {
    console.log(`Number of requests: ${++numRequests}`);
    next();
});

function checkIdStatus(req, res, next) {
    const { id } = req.params;
    if(projects.filter(p => p.id === id).length === 0)
        return res.status(400).json({error: `The id (${id}) does not exist!`});

    return next();
}

server.post('/projects/', (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.status(200).json("Poject added with success!");
});

server.get('/projects', (req, res) => {
    return res.status(200).json(projects);
});

server.put('/projects/:id', checkIdStatus, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const index = projects.findIndex(p => p.id == id);
    projects[index].title = title;

    return res.status(200).json(projects[index]);
});

server.delete('/projects/:id', checkIdStatus, (req, res) => {
    const { id } = req.params;
    const index = projects.findIndex(p => p.id == id);
    projects.splice(index, 1);
    return res.send();
});

server.post('/projects/:id/tasks', checkIdStatus, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const index = projects.findIndex(p => p.id == id);
    projects[index].tasks.push(title);
    return res.send();
});

server.listen(3000);
