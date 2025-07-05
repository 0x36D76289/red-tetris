const chalk = require('chalk');
const dayjs = require('dayjs');
require('dayjs/locale/fr');
dayjs.locale('fr');

// Format : "22 avril 2025 - 13:45:01"
function formatTimestamp() {
    return chalk.bold.white(`🕒 ${dayjs().format('DD MMMM YYYY - HH:mm:ss')}`);
}

function logInfo(message) {
    console.log(`${formatTimestamp()} ${chalk.bgBlue.white(' [INFO] ')} ${chalk.blue(message)}`);
}

function logSuccess(message) {
    console.log(`${formatTimestamp()} ${chalk.bgGreen.black(' [SUCCESS] ')} ${chalk.green(message)}`);
}

function logError(message) {
    console.log(`${formatTimestamp()} ${chalk.bgRed.white(' [ERROR] ')} ${chalk.red(message)}`);
}

function logWarning(message) {
    console.log(`${formatTimestamp()} ${chalk.bgYellow.black(' [WARN] ')} ${chalk.yellow(message)}`);
}

module.exports = {
    logInfo,
    logSuccess,
    logError,
    logWarning,
};
