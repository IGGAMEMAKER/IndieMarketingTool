const servers = require("./Configs/servers");

const projectDir = '/usr/marketing/';
const projectName = 'IndieMarketingTool'

const gitPath = `${projectDir}${projectName}`;
const pathToConfigs = gitPath + '/app/my-app/CD'

const frontendURL = 'http://releasefaster.com'
const goToFrontendRoot = 'cd app/my-app/ ;'

const uploadCertificates = true
const uploadDefaultFiles = false
const uploadNginxConfig  = true

const sslFiles = [
  "releasefaster_com.crt",
  "releasefaster.com.key",
  "releasefaster_com_chain.crt",
  "releasefaster_com.ca-bundle"
]

const mainConfigs = [
  'confs.json',
  'Passwords.js',
  'hosts.json',
]

const serviceList = [
  {ip: servers.DB_IP, scriptName: 'app/my-app/server/server', app: 'DB'}
]

const runFrontendConfigs = [] // empty if frontend is on same server as backend

const hostsJSONPath = "./Configs/hosts.json";

module.exports = {
  projectDir,
  projectName,
  gitPath,
  pathToConfigs,
  frontendURL,
  goToFrontendRoot,
  uploadCertificates,
  uploadDefaultFiles,
  uploadNginxConfig,
  sslFiles,
  hostsJSONPath,

  serviceList,
  runFrontendConfigs,

  mainConfigs,
}
