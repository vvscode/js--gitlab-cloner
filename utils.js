const fsExtra = require("fs-extra");
const ProjectsBundle = require("gitlab").ProjectsBundle;
const childProcess = require("child_process");

const execSync = (str) => {
  return childProcess.execSync(str, {
    stdio: "inherit"
  });
};

const getProjectsList = function getProjectsList(
  host,
  token,
  filter,
  maxPages,
  perPage,
  includeArchived = false
) {
  return new ProjectsBundle({
    host,
    token
  }).Projects.all({
    maxPages,
    perPage,
    archived: !!includeArchived
  }).then(projects =>
    projects.filter(
      ({ path_with_namespace }) => !!path_with_namespace.match(filter)
    )
  );
};

export function cloneAction(params) {
  const {
    host,
    token,
    ssh,
    filter,
    delay,
    maxPages,
    includeArchived,
    perPage
  } = params;

  if (!token) {
    return console.log("token is required param");
  }

  if (!host) {
    return console.log("host is required param");
  }

  return Promise.resolve(console.log("Fetch projects"))
    .then(() =>
      getProjectsList(host, token, filter, maxPages, perPage, includeArchived)
    )
    .then(projects => {
      console.log(`${projects.length} project(s) found`);
      return projects;
    })
    .then(projects => {
      projects.map(
        ({ name_with_namespace, namespace, ssh_url_to_repo }, index) => {
          console.log(`Cloning project #${index + 1}: ${name_with_namespace}`);
          const targetDir = namespace.full_path;
          fsExtra.ensureDirSync(targetDir);
          execSync(`
        cd "${targetDir}
        git clone ${ssh_url_to_repo}
        sleep ${+delay || 0}
        `);
        }
      );
    })
    .then(() => console.log("Done"))
    .catch(err => console.error("cloning error", err));
}
