const jsonServer = require("json-server");
const server = jsonServer.create();
const db = require("./db");
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecret';
const refreshTokens = [];

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add delay to every response to mimic real-world behaviors
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
    const accessToken = jwt.sign({ id: user.id, role: user.role }, accessTokenSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, refreshTokenSecret);
    refreshTokens.push(refreshToken);
    res.json({
      accessToken,
      refreshToken,
      user
    });
  } else {
    res.status(404).send({ message: 'email or password incorrect' });
  }
});

server.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  const index = refreshTokens.indexOf(refreshToken);
  if (index === -1) {
    res.send("Loutout failed");
  } else {
    refreshTokens.splice(index, 1);
    res.send("Logout successful");
  }
});

server.post('/token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
      return res.sendStatus(401);
  }

  if (!refreshTokens.includes(refreshToken)) {
      return res.sendStatus(403);
  }

  jwt.verify(refreshToken, refreshTokenSecret, (err, userInfo) => {
      if (err) {
          return res.sendStatus(403);
      }

      const accessToken = jwt.sign({ id: userInfo.id, role: userInfo.role }, accessTokenSecret, { expiresIn: '1h' });

      res.json({
          accessToken
      });
  });
});

// create the Express middleware that handles the authentication process
server.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    jwt.verify(authHeader.split(' ')[1], accessTokenSecret, (err, userInfo) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.sendStatus(401);
        }
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

// Add custom routes before JSON Server router
server.get("/employees", (req, res, next) => {
  if (req._parsedUrl.query.includes("activeEmployee")) {
    const data = [];
    const beginIndex = (parseInt(req.query._page) - 1) * parseInt(req.query._limit);
    const endIndex = beginIndex + parseInt(req.query._limit);
    const activeEmployeeId = parseInt(req.query.activeEmployee);
    const activeEmployee = db.employees.find(e => e.id === activeEmployeeId);
    const superiorId = activeEmployee.superior;
    const superior = db.employees.find(e => e.id === superiorId);
    data.push(superior);
    superior.inferiors.forEach(inferiorId => {
      data.push(db.employees.find(e => e.id === inferiorId));
    });
    activeEmployee.inferiors.forEach(inferiorId => {
      data.push(db.employees.find(e => e.id === inferiorId));
    });
    res.header('X-Total-Count', data.length);
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    const singPageData = data.slice(beginIndex, endIndex);
    singPageData.forEach(e1 => {
      e1.superior_name = db.employees.find(e2 => e2.id === e1.superior).name;
      e1.department_name = db.departments.find(d => d.id === e1.department).name;
      if (e1.inferiors && e1.inferiors.length) {
        e1.inferior_names = e1.inferiors.map(inferiorId => db.employees.find(e2 => e2.id === inferiorId).name);
      }
    });
    res.json(singPageData);
  }
  next();
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

// Use default router
server.use(router);
server.listen(3001, () => {
  console.log("JSON Server is running");
});
