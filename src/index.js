import express from 'express'
import path from 'path'

import * as log from './utils/log.js'
import { read_folder } from './parser.js'

const __dirname = import.meta.dirname;

log.info('Mapping user_data/activity/reporting')
const reporting_object = await read_folder(path.join(__dirname, '../user_data/activity/reporting'))
log.info(`Mapped total of ${reporting_object.length} items`)

log.info('Mapping user_data/activity/tns')
const tns_object = await read_folder(path.join(__dirname, '../user_data/activity/tns'))
log.info(`Mapped total of ${tns_object.length} items`)

log.info('Mapping completed. Starting server...')
const web = express()

web.get('/api/v1/activity/reporting', (req, res) => {
    const start = isNaN(req.query.start) ? 0 : Number(req.query.start);
    const end = isNaN(req.query.end) ? 50 : Number(req.query.end);

    log.info(`Received request on /api/v1/activity/reporting with start = ${start} and end = ${end}`);

    res.status(200);
    res.json({
        success: true,
        data: reporting_object.slice(start, end),
        max_object_length: reporting_object.length,
        current_start: start,
        current_end: end
    });
});

web.get('/api/v1/activity/tns', (req, res) => {
    const start = isNaN(req.query.start) ? 0 : Number(req.query.start);
    let end = isNaN(req.query.end) ? 50 : Number(req.query.end);

    if (start > tns_object.length) {
        res.status(200);
        res.json({
            success: true,
            data: [],
            max_object_length: tns_object.length,
            current_start: start,
            current_end: end
        });

        return;
    }

    if (end > 10_000) {
        // Respond only by 1000 items to avoid crazy browser lag
        end = 1_000;
    }

    log.info(`Received request on /api/v1/activity/tns with start = ${start} and end = ${end}`);

    res.status(200);
    res.json({
        success: true,
        data: tns_object.slice(start, end),
        max_object_length: tns_object.length,
        current_start: start,
        current_end: end
    });
});

// Web frontend
web.get('/activity/reporting', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/reporting.html'));
});

web.get('/activity/tns', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/tns.html'));
});

web.listen(42069, () => {
    log.info('Web server is listening to port 42069')
});
