var Jenkins =require('jenkins')({baseUrl: 'http://Rishabh:Alfanzo@001@localhost:8091',crumbIssuer: true});
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
var repbName="";
var tokensa="";
var unameer="";
const Octokit = require('@octokit/rest')
const octokit = new Octokit({
    auth: 'token c5bf37713ee935a647da9b45653febf7e87caf30'
})

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

app.post('/jenJob', function (req, res) {  

function editXML(repbName){
  var xml=`<flow-definition plugin="workflow-job@2.33">
  <actions>
  <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.3.9"/>
  </actions>
  <description/>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.72">
  <scm class="hudson.plugins.git.GitSCM" plugin="git@3.11.0">
  <configVersion>2</configVersion>
  <userRemoteConfigs>
  <hudson.plugins.git.UserRemoteConfig>
  <url>https://github.com/rishabh-99/${repbName}</url>
  </hudson.plugins.git.UserRemoteConfig>
  </userRemoteConfigs>
  <branches>
  <hudson.plugins.git.BranchSpec>
  <name>*/master</name>
  </hudson.plugins.git.BranchSpec>
  </branches>
  <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
  <submoduleCfg class="list"/>
  <extensions/>
  </scm>
  <scriptPath>Jenkinsfile</scriptPath>
  <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
  </flow-definition>`
  
  return xml;

}
var xml=editXML(repbName)


  Jenkins.job.create(`${repbName}`, xml, function(err) {
  if (err) {
    console.log("Already job is created...")
  }
  console.log("jkldshfkjsdfksjdf")
});


})

app.post('/jenJobBuild', function (req, res) {  
    
  Jenkins.job.build(`${repbName}`, function(err, data) {
    if (err) {
      console.log("Cannot build job")
    }
   
    console.log('queue item number', data);
  });
  
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
         tok=oAuth;
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
       unameer = body.login;
      tokensa = req.params.token;
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
      owner: "rishabh-99",
      repo: repbName,
      path: path,
      message: 'some message here',
      content: ''
  })
      .then(data => {
          console.log("files inserted gitHUb")
      })
      .catch(err => {
          // console.log(err)
          if (err.status === 404) {
              octokit.repos.createForAuthenticatedUser({
                  name: repbName,
              })
                  .then(data => {
                      console.log("repo created")
                      octokit.repos.createOrUpdateFile({
                          owner: "rishabh-99",
                          repo: repbName,
                          path: path,
                          message: 'some message here',
                          content: ''
                      })
                  })
                  .catch(error => {
                      console.log("repo creation failed")
                  })
          }
      })
      // console.log("done");
}


app.post('/submitRepo', (req, res) =>{

  var repositories1 = req.body.data;
 var repositories = JSON.parse(repositories1)
  console.log("****************");
  console.log(typeof(repositories));
  console.log("****************");
  
  
  const octokit = new Octokit({
    auth: `token ${tokensa}`
})
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

app.all('/creatingRepo', (req, res) => {
  repbName=req.body.rep
  const octokit = new Octokit({
    auth: `token ${tokensa}`
})
  
var jf=Buffer.from(`pipeline {
  agent any

  stages {
      stage('Build') {
          steps {
              echo 'Building..'
          }
      }
      stage('Test') {
          steps {
              echo 'Testing..'
          }
      }
      stage('Deploy') {
          steps {
              echo 'Deploying....'
          }
      }
  }
}`).toString('base64')




octokit.repos.createForAuthenticatedUser({
    name: repbName,
})
  .then(data=>{
    octokit.repos.createOrUpdateFile({
      owner: "rishabh-99",
      repo: repbName,
      path: "Jenkinsfile",
      message: 'some message here',
      content: jf
  })
  })
});

app.all('/repForJob', (req, res) => {
  repbName=req.body.rep;
});
app.post('/editYAML', function (req, res) {  
    
  var dets=req.body.final;
  var pre=dets.pre;
  var pos=dets.pos;
  var deva=dets.dev;
  var auth=dets.auth;
  var appr=dets.appr;
  var datera=dets.date

  console.log(""+pre+" "+pos+" "+deva+" "+auth+" "+appr+" "+datera)
  function editYAML(pre,pos,deva,auth,appr,datera,repbName){
    var YAML=Buffer.from(`Metadata:
    Author:${auth}
    Git-repo:https://github/rishabh-99/${repbName}
    Approval:
        Approved-by: ${appr}
        Approval-date:${datera}
Job:
    Job-name:${repbName}

    Config:
        Preunit-test:${pre}
        Postunit-test:${pos}
        Dev:${deva}
`).toString('base64')
return YAML;
  }
  const octokit = new Octokit({
    auth: `token ${tokensa}`
})
  var YAML=editYAML(pre,pos,deva,auth,appr,datera,repbName)
  console.log(YAML)
  octokit.repos.createOrUpdateFile({
    owner: "rishabh-99",
    repo: repbName,
    path: "Jenkins-metadata-template.yaml",
    message: 'some message here',
    content: YAML
})
  
  
  })




