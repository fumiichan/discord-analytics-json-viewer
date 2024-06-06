import fs from 'fs'
import path from 'path'
import readline from 'node:readline'

import * as log from './utils/log.js'

/**
 * Fetches and formats analytics data into a proper JSON. The data they sent to you
 * is a broken JSON and needed to be corrected on the fly.
 *
 * This may consume huge memory during the processing.
 *
 * @param {string} json_path URL of the discord json analytics
 * @returns {object[]} Corrected JSON data
 */
async function correct_json_data(json_path) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(json_path)
        const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity,
        });

        const json_object = []
        rl.on('line', (line, counter = ((i = 0) => () => ++i)()) => {
            try {
                json_object.push(JSON.parse(line))
            } catch (error) {
                log.warning(`Failed to parse JSON on line ${counter} in file "${json_path}"`)
            }
        });

        rl.on('close', () => {
            resolve(json_object)
        });
    });
}

/**
 * Reads entire folder containing JSON files and aggregates them into single array
 * of objects.
 * 
 * This may consume huge memory during the processing.
 *
 * @param {string} folder_path Path to the analytics folder
 * @returns {object[]} JSON object
 */
export async function read_folder(folder_path) {
    const json_object = []

    for (const file of fs.readdirSync(folder_path)) {
        if (file.endsWith('.json')) {
            // Done this way instead of spread operator to prevent max call stack exception
            const json_data = await correct_json_data(path.join(folder_path, file));
            for (const data of json_data) {
                json_object.push(data);
            }
        }
    }

    return json_object;
}
