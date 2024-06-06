import chalk from 'chalk'

const MESSAGE_TEMPLATES = {
    info:  "[Info]:    ",
    warn:  "[Warning]: ",
    error: "[Error]:   ",
    log:   "[Log]:     "
}

export function info(...message) {
    console.info(chalk.blue(...message))
}

export function warning(...message) {
    console.warn(chalk.yellow(...message))
}

export function error(...message) {
    console.error(chalk.red(...message))
}
