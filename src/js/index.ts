import '../styles/index.scss'
import '../fonts/Montserrat/style.css'
import '../fonts/Lato/style.css'


interface LogChannels {
    [key: string]: LogChannel
}

interface LogChannel {
    transport: ConsollerType,
    levels: LogChannelLevel[];
}

type LogChannelLevel = "error" | "warning" | "notice" | "info" | "debug";


interface ConsollerType {
    // static
    // build: (levels: LogChannelLevel[]) => object
    error: (message: any) => void
    warning: (message: any) => void
    notice: (message: any) => void
    info: (message: any) => void
    debug: (message: any) => void
}

interface HttpConsollerType extends ConsollerType {
    send: (type: keyof ConsollerType, body: any) => void;
}

class HttpConsoller implements HttpConsollerType {
    constructor(private url: string) { }
    static build(levels: LogChannelLevel[]): object {
        const inst = new HttpConsoller('');
        const obj = {}
        for (const level of levels) {
            // @ts-ignore
            obj[level] = inst[level];
        }
        return obj;
    }
    error(message: any) {
        // this.send('error', message);
        console.error(message)
    }
    warning(message: any) {
        // this.send('warning', message);
        console.warn(message)
    }
    notice(message: any) {
        // this.send('notice', message);
        console.info(message);
    }
    info(message: any) {
        // this.send('info', message);
        console.info(message)
    }
    debug(message: any) {
        // this.send('debug', message);
        console.debug(message)
    }
    send(type: keyof ConsollerType, body: any) {
        fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: { type, ...body },
        })
    }
}

class Consoller implements ConsollerType {
    constructor() { }
    static build(levels: LogChannelLevel[]): object {
        const inst = new Consoller();
        const obj = {}
        for (const level of levels) {
            // @ts-ignore
            obj[level] = inst[level];
        }
        return obj;
    }
    error(message: any) {
        console.error(message)
    }
    warning(message: any) {
        console.warn(message)
    }
    notice(message: any) {
        this.info(message);
    }
    info(message: any) {
        console.info(message)
    }
    debug(message: any) {
        console.debug(message)
    }
}



class Logger {
    constructor(public channels: LogChannels) {
        this.addMethods()
    }

    static build(channels: LogChannels) {
        return new Logger(channels);
    }

    private addMethods() {
        for (const key of Object.keys(this.channels)) {
            const channel = this.channels[key];
            const inst = channel.transport.constructor;
            // @ts-ignore
            this[key] = inst.build(channel.levels);
        }
    }
}

const loggerConfig: LogChannels = {
    mail: {
        levels: ['info', 'warning'],
        transport: new Consoller()
    },
    exchange: {
        levels: ['error', 'debug'],
        transport: new HttpConsoller('/'),
    },
}

const logger = Logger.build(loggerConfig);

console.log('logger', logger)


// @ts-ignore
// logger.mail.error("Все пропало, шеф!");
// @ts-ignore
logger.mail.warning("Все пропало, шеф!");
// @ts-ignore
// logger.mail.notice("Все пропало, шеф!");
// @ts-ignore
logger.mail.info("Все пропало, шеф!");
// @ts-ignore
// logger.mail.debug("Все пропало, шеф!");


// @ts-ignore
logger.exchange.error("exchange, шеф!");
// @ts-ignore
// logger.exchange.warning("exchange, шеф!");
// @ts-ignore
// logger.exchange.notice("exchange, шеф!");
// @ts-ignore
// logger.exchange.info("exchange, шеф!");
// @ts-ignore
logger.exchange.debug("exchange, шеф!");