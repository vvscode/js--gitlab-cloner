const fsExtra = require('fs-extra');
const { ProjectsBundle } = require('gitlab');
const childProcess = require('child_process');

const execSync = str => childProcess.execSync(str, { stdio: 'inherit' });

const getProjectsList = (host, token, filter) => new ProjectsBundle({
  host,
  token,
})
  .Projects.all()
  .then((projects) => projects.filter(project => !!project.path_with_namespace.match(filter)));

module.exports.cloneAction = (...args) => {
  const {
    host,
    token,
    ssh,
    filter,
    delay
  } = args[args.length - 1];

  if (!token) {
    return console.log('token is required param');
  }
  if (!host) {
    return console.log('host is required param');
  }

  console.log('cloneAction', {
    host,
    token,
    ssh,
    filter,
  });

  return Promise.resolve(console.log('Fetch projects'))
    .then(() => getProjectsList(host, token, filter))
    .then(projects => {
      console.log(`${projects.length} project(s) found`);
      return projects;
    })
    .then((projects) => {
      projects.map((project, index) => {
        console.log(`Cloning project #${index + 1}: ${project.name_with_namespace}`)
        const targetDir = project.namespace.full_path;
        fsExtra.ensureDirSync(targetDir);
        execSync(` 
          cd "${targetDir}"
          git clone ${project.ssh_url_to_repo}
          sleep ${(+delay || 0)}
        `);
      });
    })
    .then(() => console.log('\n\nDone'))
    .catch((err) => console.error('cloning error', err));
}