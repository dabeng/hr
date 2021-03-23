const jsonServer = require("json-server");
const server = jsonServer.create();
const db = require("./db");
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add delay to responses(ms)
server.use(function(req, res, next){
  setTimeout(next, 1000);
});

server.use(jsonServer.bodyParser);

server.post('/login', (req, res) => {
  // Read username and password from request body
  const { email, password } = req.body;
  // Filter user from the users array by username and password
  const user = db.employees.find(u => { return u.email === email && u.password === password });
  if (user) {
    // Generate an access token
    const token = jwt.sign({ id:user.id, role: user.role }, accessTokenSecret, { expiresIn: '1h' });
    res.json({
      token,
      user
    });
  } else {
    res.status(404).send({ message: 'email or password incorrect' });
  }
});



server.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    jwt.verify(authHeader.split(' ')[1], accessTokenSecret, (err, userInfo) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = userInfo;
      next();
    });
  } else {
    res.sendStatus(401);
  }
});

server.get('/user', (req, res) => {
  const user = db.employees.find(u => { return u.id === req.user.id });
  if (user) {
    res.json(user);
  } else {
    res.json({});
  }
});

router.render = (req, res) => {
  if (req.method === "GET") {
    if (req.path === "/employees") {
      res.locals.data.forEach(e1 => {
        e1.superior_name = db.employees.find(e2 => e2.id === e1.superior).name;
        e1.department_name = db.departments.find(d => d.id === e1.department).name;
        if (e1.inferiors && e1.inferiors.length) {
          e1.inferior_names = e1.inferiors.map(inferiorId => db.employees.find(e2 => e2.id === inferiorId).name);
        }
      });
    }

    if (req.path === "/employees/" + res.locals.data.id) {
      const employee = res.locals.data;
      employee.superior_name = db.employees.find(e => e.id === employee.superior).name;
      employee.department_name = db.departments.find(d => d.id === employee.department).name;
      if (employee.inferiors && employee.inferiors.length) {
        employee.inferior_names = employee.inferiors.map(inferiorId => db.employees.find(e => e.id === inferiorId).name);
      }
    }
  }
  res.jsonp(res.locals.data);
};



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
