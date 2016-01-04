var nconf = require('nconf');
var CONFIG_PATH = "./config/config.json";
nconf.use('file', { file: CONFIG_PATH});

var log = require('bristol');
// high_priority.log will contain only errors and warns
log.addTarget('file', {file: './logs/high_priority.log'})
    .withLowestSeverity('warn')
    .withFormatter('human');

log.info("Configuration file loaded", {file: CONFIG_PATH});

var saveConf = function(){
  nconf.save(function (err) {
    if (err) {
      log.error("Impossible de sauver la configuration", {file: CONFIG_PATH});
      return;
    }
    log.info("Configuration saved successfully", {file: CONFIG_PATH});
  });
}
  
  
var confDatabase= nconf.get('database');
  
  
 // EXPORTS
exports.saveConf = saveConf;
exports.confDatabase = confDatabase;