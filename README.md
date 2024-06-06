# Discord Analytics Viewer

An express web server that parses your Discord analytics file exported from discord that
displays the analytics in a **long** table view. This is useful if you want to review
what Discord gathered during your use.

## Requirements

- Your unpacked exports:
    - activity/reporting/events-*.json
    - activity/tns/events-*.json
- Node.js

## Usage

1. Copy the required files in `user_data` folder in the project root.
2. Run `start.cmd` or `node ./src/index.js`
3. Open your browser at `http://localhost:42069/analytics/report` and `http://localhost:42069/analytics/tns`

## Future TODOs:

Idk, better UI maybe

## License

[MIT](LICENSE)
