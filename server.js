const jsonServer = require("json-server");
const server = jsonServer.create();
const db = require("./db");
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

router.render = (req, res) => {
  if (req.method === "GET" && req.path === "/employees") {
    res.locals.data.forEach(e1 => {
      e1.superior_name = db.employees.find(e2 => e2.id === e1.superior).name;
      e1.department_name = db.departments.find(d => d.id === e1.department).name;
    });
  }
  res.jsonp(res.locals.data);
};

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(db.employees[1]);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {

  // Continue to JSON Server router
  next();
});

// Use default router
server.use(router);
server.listen(3001, () => {
  console.log("JSON Server is running");
});
