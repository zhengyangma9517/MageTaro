
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { JustDetective } from 'justtools';
import { Logger } from './Logger';

export enum ConfigSections {
    Service = 'service',
    Stationery = 'stationery',
    Connections = 'connections',
    Environment = 'environment'
}

export class Configurations {
    private service: any | null;
    private stationery: any | null;
    private connections: any | null;
    private environment: any | null;
    private config: any | null;

    /**
     * get local source function
     * @param str sections enum string
     */
    public getSource(str: string) {
        switch (str) {
            case ConfigSections.Connections: { return this.connections; break; }
            case ConfigSections.Environment: { return this.environment; break; }
            case ConfigSections.Service: { return this.service; break; }
            case ConfigSections.Stationery: { return this.stationery; break; }
        }
    }

    /**
     * configurations constructor function
     * @param file path of appsettings.json file
     * @param logger logger instance
     */
    public constructor(private file: string, public logger: Logger) {
    }

    /**
     * to initialize the configurations
     */
    public async initialize(): Promise<void> {
        if (existsSync(this.file)) {
            this.config = JSON.parse(readFileSync(this.file).toString());
            JustDetective.detect(this.config, async (v: any) => {
                this.connections = this.config.connections;
                this.environment = this.config.environment;
                this.service = this.config.service;
                this.stationery = this.config.stationery;
                await this.logger.info('Configurations Imported');
                this.config = null;
            },
            '/error format or path/appsettings.json'
            );
        } else {
            await this.logger.fatal('Can not find appsettings.json file');
            this.config = null;
        }
    }

    public async saveEnv( field: string, data: any ): Promise<void> {
        this.environment[field] = data;
        if (existsSync(this.file)) {
            writeFileSync(this.file, JSON.stringify(
                {
                    service: this.service,
                    connections: this.connections,
                    stationery: this.stationery,
                    environment: this.environment
                },
                null,
                '\t'
            )
            );
        }
    }
}
