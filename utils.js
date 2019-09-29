"use strict";

var fsExtra = require("fs-extra");

var _require = require("gitlab"),
  ProjectsBundle = _require.ProjectsBundle;

var childProcess = require("child_process");

var execSync = function execSync(str) {
  return childProcess.execSync(str, {
    stdio: "inherit"
  });
};

var getProjectsList = function getProjectsList(host, token, filter) {
  return new ProjectsBundle({
    host: host,
    token: token
  }).Projects.all().then(function (projects) {
    return projects.filter(function (project) {
      return !!project.path_with_namespace.match(filter);
    });
  });
};

module.exports.cloneAction = function () {
  var _ref;

  var _ref2 = ((_ref = arguments.length - 1),
    _ref < 0 || arguments.length <= _ref ? undefined : arguments[_ref]),
    host = _ref2.host,
    token = _ref2.token,
    ssh = _ref2.ssh,
    filter = _ref2.filter,
    delay = _ref2.delay;

  if (!token) {
    return console.log("token is required param");
  }

  if (!host) {
    return console.log("host is required param");
  }

  return Promise.resolve(console.log("Fetch projects"))
    .then(function () {
      return getProjectsList(host, token, filter);
    })
    .then(function (projects) {
      console.log(projects.length + " project(s) found");
      return projects;
    })
    .then(function (projects) {
      projects.map(function (project, index) {
        console.log(
          "Cloning project #" + (index + 1) + ": " + project.name_with_namespace
        );
        var targetDir = project.namespace.full_path;
        fsExtra.ensureDirSync(targetDir);
        execSync(
          ' \n          cd "' +
          targetDir +
          '"\n          git clone ' +
          project.ssh_url_to_repo +
          "\n          sleep " +
          (+delay || 0) +
          "\n        "
        );
      });
    })
    .then(function () {
      return console.log("\n\nDone");
    })
    .catch(function (err) {
      return console.error("cloning error", err);
    });
};
