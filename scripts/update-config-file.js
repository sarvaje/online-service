const path = require('path');
const fs = require('fs');

const getComposeFilePath = (file) => {
    if (file) {
        return path.join(process.cwd(), file);
    }

    return path.join(__dirname, '..', 'compose', 'kubernetes-azure.yaml');
};

const updateConfigFile = (repository, newVersion, file) => {
    if (!repository) {
        console.error('Repository required');
        console.log(`Please use ${process.argv[0]} ${process.argv[1]} REPOSITORY [newVersion [[kubernetes file path]]`);

        return;
    }

    const version = newVersion || 'latest';

    const composeFilePath = getComposeFilePath(file);

    console.log(`Updating file: ${composeFilePath} ...`);

    const currentContent = fs.readFileSync(composeFilePath, { encoding: 'utf-8' }); // eslint-disable-line no-sync

    const finalContent = currentContent.replace(/image:([^/]+)([^:]+:)(.*)/g, `image: ${repository}$2${version}`);

    fs.writeFileSync(composeFilePath, finalContent, { encoding: 'utf-8' }); // eslint-disable-line no-sync

    console.log('Kubernetes config file updated');
};

module.exports = updateConfigFile;

if (process.argv[1].indexOf('update-config-file.js') !== -1) {
    updateConfigFile(process.argv[2], process.argv[3], process.argv[4]);
}
