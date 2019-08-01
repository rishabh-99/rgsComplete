app.all('/gettingRepo', (req, res) => {
  reposiName = req.body.reeeepo;
  connection.query(
    "SELECT token FROM userdet where mailId=? ",[loginEmail],
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      oAuth = result;
      res.send(result);
    }
  );
  console.log("^^^^^^^^^^^^^^^");
  console.log(reposiName);
  console.log("^^^^^^^^^^^^^^^");
  createOctokitRepos(reposiName);
	res.send(reposiName);
})

var Jenkins =require('jenkins')({baseUrl: 'http://admin:Alfanzo001@localhost:8081',crumbIssuer: true});
require('dotenv').config();
const express = require('express');
const app = express();
var path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const session = require('express-session');
const request = require('request');
const qs = require('querystring');
const url = require('url');
const randomString = require('randomstring');
const csrfString = randomString.generate();
const port = process.env.PORT || 8080;
const redirect_uri = process.env.HOST + '/redirect';
const router = express.Router();
const connection = require('./config');
var loginEmail = "";
var userData = "";
var repoData = "";
var reposIdphp = 0;
var reposiName = "";
var oAuth = "";
const Octokit = require('@octokit/rest')



var xml=`<?xml version='1.0' encoding='UTF-8'?>
<project>
  <actions/>
  <description></description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <scm class="hudson.plugins.git.GitSCM" plugin="git@2.4.3">
    <configVersion>2</configVersion>
    <userRemoteConfigs>
      <hudson.plugins.git.UserRemoteConfig>
        <url>https://github.com/tgross/triton-nginx</url>
      </hudson.plugins.git.UserRemoteConfig>
    </userRemoteConfigs>
    <branches>
      <hudson.plugins.git.BranchSpec>
        <name>*/master</name>
      </hudson.plugins.git.BranchSpec>
    </branches>
    <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
    <submoduleCfg class="list"/>
  </scm>
  <canRoam>true</canRoam>
  <disabled>false</disabled>
  <blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
  <blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
  <triggers>
    <hudson.triggers.SCMTrigger>
      <spec>H/15 * * * *</spec>
      <ignorePostCommitHooks>false</ignorePostCommitHooks>
    </hudson.triggers.SCMTrigger>
  </triggers>
  <concurrentBuild>false</concurrentBuild>
  <builders>
    <hudson.tasks.Shell>
      <command>docker build -t=&quot;${repoData}:$BUILD_NUMBER&quot; .</command>
    </hudson.tasks.Shell>
  </builders>
  <publishers/>
  <buildWrappers/>
</project>`

app.use(express.static('views'));
var authenticateController = require('./controllers/authenticate-controller');
var registerController = require('./controllers/register-controller');
app.use(bodyParser.urlencoded({ extended: true }));


/* route to handle login and registration */
app.post('/api/register', registerController.register);
app.post('/api/authenticate', authenticateController.authenticate);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);
app.listen(8012);

app.use(
  session({
    secret: randomString.generate(),
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);


//Accessing Oauth token starts here
app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
});

// user login/registration API
app.get('/login.html', function (req, res) {  
  res.sendFile( __dirname + "/" + "login.html" );  
})  
app.get('/register.html', function (req, res) {  
  res.sendFile( __dirname + "/" + "register.html" );  
})  
app.get('/home.html', function (req, res) {  
  res.sendFile( __dirname + "/" + "home.html" );  
})  

app.listen(port, () => {
  console.log('Server listening at port ' + port);
});

// jenkins starts here

app.post('/jenJob', function (req, res) {  
//   Jenkins.info(function(err,data){

//     console.log('info',data);
// }); 
Jenkins.job.create('exdhsgl', xml, function(err) {
  if (err) throw err;
  console.log("jkldshfkjsdfksjdf")
});
// Jenkins.job.build('example', function(err, data) {
//   if (err) throw err;
 
//   console.log('queue item number', data);
//});

})


app.get('/login', (req, res, next) => {
  req.session.csrf_string = randomString.generate();
  const githubAuthUrl =
    'https://github.com/login/oauth/authorize?' +
    qs.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: redirect_uri,
      state: req.session.csrf_string,
      scope: 'repo'
    });
  res.redirect(githubAuthUrl);
});

app.post('/loginEmail',(req, res) => {
  loginEmail = req.body.name;
  console.log("#$#^#&");
  console.log(loginEmail);
  console.log("#$#^#&");
})






app.all('/redirect', (req, res) => {
  console.log('Request sent by GitHub: ');
  console.log(req.query);
  const code = req.query.code;
  const returnedState = req.query.state;

  if (req.session.csrf_string === returnedState) {
    request.post(
      {
        url:
          'https://github.com/login/oauth/access_token?' +
          qs.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code,
            redirect_uri: redirect_uri,
            state: req.session.csrf_string
          })
      },
      (error, response, body) => {
        console.log('Your Access Token: ');
        console.log(qs.parse(body));
        req.session.access_token = qs.parse(body).access_token;
        oAuth = req.session.access_token;
        connection.query(
          'UPDATE userDet SET token =? WHERE mailId=?',[oAuth,loginEmail],
          function (err, result) {
            if (err) {
              console.log(err);
              return; 
            }
            console.log("---@@@------")
            console.log(result);
            console.log("---@@@------")
          }
        );
        res.redirect(`/user/${req.session.access_token}`);
      }
    );
  } else {
    res.redirect('/');
  }
});

const octokit = new Octokit({
  auth: `token ${oAuth}`
})

function createOctokitRepos(reposiName){
octokit.repos.createForAuthenticatedUser({
  name : reposiName,
  description : 'welcome to the Github',
  is_template : 'No'
})
}


app.all('/userId', (req, res) => {
  connection.query(
    "select userId from userDet where mailId = ? ",[loginEmail],
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      userData = result;
      res.send(userData);
    }
  );
 
});

app.all('/repoId', (req, res) => {
  connection.query(
    "select pid from reposDet where userId = ? ",[userData],
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      repoData = result;
      res.send(repoData);
      console.log("!!!!!!!!!!!!!!!!!");
      console.log(userData);
      console.log(repoData);
      console.log("!!!!!!!!!!!!!!!!!");
    }
  );
 
});




app.get('/user/:token', (req, res) => {
  request.get(
    {
      url: 'https://api.github.com/user/public_emails',
      headers: {
        Authorization: 'token ' + req.session.access_token,
        'User-Agent': 'Login-App'
      }
    },
    (error, response, body) => {
      body = JSON.parse(body);
      var uname = body.login;
      var token = req.params.token;
      res.redirect(`http://localhost/repos2.php`)
    }
  );
});

app.get('/listAll/:uname/:token',(req,res)=> {
  res.sendFile(path.join(__dirname+'/home.html'))
})

// data storing for repositories
app.post('/repoName', function (req, res) {
  res.set({
    'Access-Control-Allow-Origin': '*'
  })
  console.log("@@@@@@");
  var repoName = req.body.name;
  var result1;
  id = 0;
  console.log(repoName);
  connection.query(
    "Insert into reposDet (repoID,repoName) VALUES ('" + id + "','" + repoName + "')",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
      result1 = result;
    }
  );
  res.send({result1});
  
});

app.get('/repoLists', (req, res) => {
  connection.query(
    "SELECT repoName FROM reposDet",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result)
      res.send(result);
    }
  );
});


// retrieving data from database
app.get('/getFolders', (req, res) => {
  connection.query(
    "SELECT * FROM fileStructure",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.send(result);
    }
  );
});

app.all('/getRname',(req,res) =>{

  connection.query(
    "SELECT name FROM userId where pid=? ",[repoData],
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.send(result);
    }
  );
});

//To fetch repoName
app.all('/getRepoName',(req,res) =>{

  connection.query(
    "SELECT name FROM reposdet where pid=? ",[userData],
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.send(result);
    }
  );
});

app.all('/getAuthToken',(req,res) =>{

  connection.query(
    "SELECT token FROM userdet where userId=? ",[repoData],
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.send(result);
    }
  );
});



app.post('/reposId',(req, res) => {
  reposIdphp = req.body.sendRepo1;
})

app.all('/idRepos', (req, res) => {
    res.send(reposIdphp);
});


// octokit calling to update the repo

function octokitData(octokit, path) {
   octokit.repos.createOrUpdateFile({
      owner: "robin9421",
      repo: robin,
      path: path,
      message: 'some message here',
      content: ''
  })
      .then(data => {
          console.log("files inserted gitHUb")
      })
      .catch(err => {
          console.log(err)
      // console.log("done");
      })
}


app.post('/submitRepo', (req, res) =>{

  var repositories1 = req.body.toRobin;
 var repositories = JSON.parse(repositories1)
  console.log("****************");
  console.log(typeof(repositories));
  console.log("****************");
  traverse(repositories, "", octokit);



  function traverse(repositories, path, octokit) {
      if (repositories !== null && typeof(repositories) == "object") {
          if (repositories.constructor === Array) {
              for (var i = 0; i < repositories.length; i++) {
                  traverse(repositories[i], path, octokit);
              }
          }
          else {
              if (repositories.hasOwnProperty('nodes') && Object.entries(repositories.nodes).length != 0) {
                  path += repositories.text + '/';
                  
              }
              else {
                  path += repositories.text;
                  console.log(path);
                  setInterval(function(){
                    octokitData(octokit,path);
                  },3000);
                  
              }
              traverse(repositories.nodes, path, octokit);
          }
      }
  else {
      return
  }
  console.log("%%%%%%%%%%%%%%%%");
  console.log(repositories);
  console.log("%%%%%%%%%%%%%%%%");

  }
});


