const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./resources/application.properties');

const COMBINED_LOG = properties.get('sysCombinedLog');
const ERROR_LOG = properties.get('sysErrorLog');

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  });

var timeZoned = () => { return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Taipei'
})};

module.exports = {
    getLogger: (fileName) => {
        const logger = winston.createLogger({
            level: 'info',
            // format: winston.format.json(),
            format: combine(label({label: fileName}), timestamp({format: timeZoned}), myFormat),
            transports: [
                new winston.transports.File({ filename: COMBINED_LOG }),
                new winston.transports.File({ filename: ERROR_LOG, level: 'error'}),
                new winston.transports.Console()
            ],
        });
        logger.exceptions.handle(
            new winston.transports.File({ filename: ERROR_LOG })
        );
        return logger;
    }
}