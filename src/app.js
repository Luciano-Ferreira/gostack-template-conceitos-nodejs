const express = require("express");
const cors = require("cors");

const { v4: uuid }  = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository ID." })
  }

  return next();
}


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes = 0 } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes
  }

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});
  }
  const changedRepository = {
    id: repositories[repositoryIndex].id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = changedRepository;
  return response.json(changedRepository);
});

app.delete("/repositories/:id", (request, response) => {

  // Obter o ID
  const { id } = request.params;

  //Buscar o repositório solicitado
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Se repositoryIndex dor menor que 0 retorne status 400 e a mensagem de erro

  if (repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found.'});
  }
  
  //Exclui repositorio
  repositories.splice(repositoryIndex, 1);

  //retorna status 204
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository){
    return response.status(400).json({ error: "Repository does not exist." });
  }

  repository.likes += 1;
  
  return response.json(repository);
});

module.exports = app;
