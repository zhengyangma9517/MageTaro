import 'colors';

export class Logger {
    public constructor( private name: string ) {
    }

    public async fatal(...args: any[]): Promise<void> {
        console.error(`[${new Date().toISOString()}]`.green + ` FATAL `.red + `[${this.name}] `.green, ...args);
    }

    public async error(...args: any[]): Promise<void> {
        console.error(`[${new Date().toISOString()}]`.green + ` ERROR `.red + `[${this.name}] `.green, ...args);
    }

    public async warn(...args: any[]): Promise<void> {
        console.warn(`[${new Date().toISOString()}]`.green + ` WARN  `.yellow + `[${this.name}] `.green, ...args);
    }

    public async info(...args: any[]): Promise<void> {
        console.info(`[${new Date().toISOString()}]`.green + ` INFO  `.blue + `[${this.name}] `.green, ...args);
    }

    public async debug(...args: any[]): Promise<void> {
        console.debug(`[${new Date().toISOString()}]`.green + ` DEBUG `.gray + `[${this.name}] `.green, ...args);
    }

    public async trace(...args: any[]): Promise<void> {
        console.trace(`[${new Date().toISOString()}]`.green + ` FATAL `.gray + `[${this.name}] `.green, ...args);
    }

}
