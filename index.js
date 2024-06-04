const express = require("express");

const fs = require("fs").promises;
const path = require("path");

const app = express();
const port = 8000;

const Users = [];
const routes = [];

app.use(express.json());

const getAllRoutes = async (pathname) => {
  try {
    // Gets all files and directories
    const items = await fs.readdir(pathname);

    // For each cannot handle async operations effectively
    // That's why I have used this syntax
    for (const item of items) {
      if (item === "node_modules") continue;
      const itemPath = path.join(pathname, `./${item}`);
      if (item === "route.js") return routes.push(itemPath);
      // Recursively search for router.js
      await getAllRoutes(itemPath);
    }
  } catch (error) {
    return;
  }
};

const getRoutePath = (absRoutePath) => {
  const pathArr = absRoutePath.split("/");

  let path = "";
  let index = 0;
  while (true) {
    const split = pathArr[index];
    if (split === "routes") {
      path = pathArr.slice(index + 1, pathArr.length - 1).join("/");
      break;
    }
    index++;
  }
  return path;
};

// Running the server only after getting all the routes
getAllRoutes(path.join(__dirname, "./")).then(() => {
  app.listen(port, () => {
    console.log(`App listening on port:${port}`);
  });

  for (const absRoutePath of routes) {
    // Dynamically importing routes
    const route = require(absRoutePath);

    const routePath = getRoutePath(absRoutePath);

    switch (route.name) {
      case "Post":
        app.post(`/api/${routePath}`, (req, res) => route(req, res));
      case "Put":
        app.put(`/api/${routePath}`, (req, res) => route(req, res));
      case "Delete":
        app.delete(`/api/${routePath}`, (req, res) => route(req, res));
      default:
        app.get(`/api/${routePath}`, (req, res) => route(req, res));
    }
  }
});

module.exports = Users;
