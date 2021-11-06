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
    res.status(401).send({ message: 'email or password incorrect' });
  }
});

// When the user requests to logout, we will remove the refresh token from our array.
// It makes sure that when the user is logged out, no one will be able to
// use the refresh token to generate a new authentication token.
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

// let's create a request handler that generated new tokens based on the refresh tokens
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

/* Add custom routes before JSON Server router
 * 这里就没有json-server默认提供的完备的response了，得自己攒
*/
server.get("/employees", (req, res, next) => {
  // 根据一个employee的id，查找他/她的直接上级，直接下级，最后再加上他/她自身，最后返回结果集
  if (req.query.activeEmployee) {
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
    if (activeEmployee.inferiors) {
      activeEmployee.inferiors.forEach(inferiorId => {
        data.push(db.employees.find(e => e.id === inferiorId));
      });
    }
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
  } // 从一个employee出发，查询他的可选上级/下级数据，这个接口在修改某个employee的直接上级/下级时用到
  else if (req.query.self) {
    // 依据关键字，进行全局搜索
    let data = db.employees.filter(function(obj) {
      return Object.keys(obj).some(function(key) {
        return obj[key].constructor === String ? obj[key].includes(req.query.q) : false;
      })
    });
    // 在候选列表中去掉自身和下级，或者自身和汇报上级
    const selfEmployeeId = parseInt(req.query.self);
    const selfEmployee = db.employees.find(item => item.id === selfEmployeeId);
    if (req.query.candidate === 'superior') {
      const inferiorIds = [selfEmployeeId];
      const loopInferior = (inferior) => {
        if (inferior && inferior.inferiors && inferior.inferiors.length > 0) {
          inferior.inferiors.forEach(item => {
            inferiorIds.push(item);
            loopInferior(db.employees.find(item2 => item2.id === item));
          });
        }
      };
      loopInferior(selfEmployee);
      data = data.filter(item => !inferiorIds.includes(item.id));
    } else if (req.query.candidate === 'inferior') {
      const superiorIds = [];
      let superior = selfEmployee;
      while (superior) {
        superiorIds.push(superior.id);
        superior = superior.id !== superior.superior ? db.employees.find(item => item.id === superior.superior) : undefined;
      }
      data = data.filter(item => !superiorIds.includes(item.id));
    }
    // 下面的代码给response附上查询结果总数，上级名称，下级名称
    res.header('X-Total-Count', data.length);
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    const beginIndex = (parseInt(req.query._page) - 1) * parseInt(req.query._limit);
    const endIndex = beginIndex + parseInt(req.query._limit);
    const singPageData = data.slice(beginIndex, endIndex);
    singPageData.forEach(e1 => {
      e1.superior_name = db.employees.find(e2 => e2.id === e1.superior).name;
      e1.department_name = db.departments.find(d => d.id === e1.department).name;
      if (e1.inferiors && e1.inferiors.length) {
        e1.inferior_names = e1.inferiors.map(inferiorId => db.employees.find(e2 => e2.id === inferiorId).name);
      }
    });
    res.json(singPageData);
  } else {
    next();
  }
});

server.get("/employees/orgchart", (req, res, next) => {
  if (req.query.employeeId) {
    const currentEmployeeId = parseInt(req.query.employeeId);
    const currentEmployee = db.employees.find(e => e.id === currentEmployeeId);
    const superiorId = currentEmployee.superior;
    const superior = db.employees.find(e => e.id === superiorId);
    const data = {...superior, children:[]};
    superior.inferiors.forEach(inferiorId => {
      if (inferiorId === currentEmployeeId && currentEmployee.inferiors) {
        currentEmployee.children = [];
        currentEmployee.inferiors.forEach(inferiorId => {
          currentEmployee.children.push(db.employees.find(e => e.id === inferiorId));
        });
        data.children.push(currentEmployee);
      } else {
        data.children.push(db.employees.find(e => e.id === inferiorId));
      }
    });

    res.json(data);
  }
});

router.render = (req, res) => {
  if (req.method === "GET") {
    if (req.path === "/employees") {
      res.locals.data.forEach(e1 => {
        // 追加上级姓名
        e1.superior_name = db.employees.find(e2 => e2.id === e1.superior).name;
        // 追加部门名称
        e1.department_name = db.departments.find(d => d.id === e1.department).name;
        // 追加下级姓名
        if (e1.inferiors && e1.inferiors.length) {
          e1.inferior_names = e1.inferiors.map(inferiorId => db.employees.find(e2 => e2.id === inferiorId).name);
        }
      });
      res.json(res.locals.data);
    } else if (req.path === "/employees/" + res.locals.data.id) {
      const employee = res.locals.data;
      employee.superior_name = db.employees.find(e => e.id === employee.superior).name;
      employee.department_name = db.departments.find(d => d.id === employee.department).name;
      if (employee.inferiors && employee.inferiors.length) {
        employee.inferior_names = employee.inferiors.map(inferiorId => db.employees.find(e => e.id === inferiorId).name);
      }
      res.json(res.locals.data);
    } else if (req.path === "/departments") {
      res.json(res.locals.data);
    }
  } else if (req.method === "PATCH") {
    if (req.path === "/employees/" + res.locals.data.id) {
      const employee = res.locals.data;
      employee.superior_name = db.employees.find(e => e.id === employee.superior).name;
      employee.department_name = db.departments.find(d => d.id === employee.department).name;
      if (employee.inferiors && employee.inferiors.length) {
        employee.inferior_names = employee.inferiors.map(inferiorId => db.employees.find(e => e.id === inferiorId).name);
      }
      res.json(res.locals.data);
    }
  }
};

// Use default router
server.use(router);
server.listen(3001, () => {
  console.log("JSON Server is running");
});
