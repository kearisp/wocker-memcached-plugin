import {Service, ServiceProps} from "./Service";


export type ConfigProps = {
    adminHost?: string;
    default?: string;
    services?: ServiceProps[];
};

export abstract class Config {
    public adminHost: string;
    public default?: string;
    public services: Service[];

    public constructor(props: ConfigProps) {
        const {
            adminHost = "dbadmin-memcached.workspace",
            default: defaultService,
            services = []
        } = props;

        this.adminHost = adminHost;
        this.default = defaultService;
        this.services = services.map(service => new Service(service));
    }

    public getService(name: string): Service {
        const service = this.services.find((service) => service.name === name);

        if(!service) {
            throw new Error(`Memcached "${name}" service not found`);
        }

        return service;
    }

    public getDefaultService(): Service {
        if(!this.default) {
            throw new Error("No services are installed by default");
        }

        return this.getService(this.default);
    }

    public getServiceOrDefault(name?: string): Service {
        if(!name) {
            return this.getDefaultService();
        }

        return this.getService(name);
    }

    public hasService(name: string): boolean {
        const service = this.services.find((service) => service.name === name);

        return !!service;
    }

    public setService(service: Service): void {
        let exists = false;

        for(let i = 0; i < this.services.length; i++) {
            if(this.services[i].name === service.name) {
                exists = true;
                this.services[i] = service;
            }
        }

        if(!exists) {
            this.services.push(service);
        }

        if(!this.default) {
            this.default = service.name;
        }
    }

    public unsetService(name: string): void {
        this.services = this.services.filter((service) => {
            return service.name !== name;
        });

        if(this.default === name) {
            delete this.default;
        }
    }

    public hasDefaultService(): boolean {
        if(!this.default) {
            return false;
        }

        return this.hasService(this.default);
    }

    public abstract save(): void;

    public toObject(): ConfigProps {
        return {
            adminHost: this.adminHost,
            default: this.default,
            services: this.services.length > 0
                ? this.services.map((service) => service.toObject())
                : undefined
        };
    }
}
