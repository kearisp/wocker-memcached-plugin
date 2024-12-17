import {ConfigCollection} from "@wocker/core";

import {Service, ServiceProps} from "./Service";


export type ConfigProps = {
    adminHost?: string;
    default?: string;
    services?: ServiceProps[];
};

export abstract class Config {
    public adminHost: string;
    public default?: string;
    public services: ConfigCollection<Service, ServiceProps>;

    public constructor(props: ConfigProps) {
        const {
            adminHost = "dbadmin-memcached.workspace",
            default: defaultService,
            services = []
        } = props;

        this.adminHost = adminHost;
        this.default = defaultService;
        this.services = new ConfigCollection(Service, services);
    }

    public getService(name: string): Service {
        const service = this.services.getConfig(name);

        if(!service) {
            throw new Error(`Memcached "${name}" service not found`);
        }

        return service;
    }

    public getDefaultService() {
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
        return !!this.services.getConfig(name);
    }

    public setService(service: Service): void {
        this.services.setConfig(service);

        if(!this.default) {
            this.default = service.name;
        }
    }

    public unsetService(name: string): void {
        this.services.removeConfig(name);

        if(this.default === name) {
            delete this.default;
        }
    }

    public hasDefaultService(): boolean {
        if(!this.default) {
            return false;
        }

        return !!this.services.getConfig(this.default);
    }

    public abstract save(): void;

    public toObject(): ConfigProps {
        return {
            adminHost: this.adminHost,
            default: this.default,
            services: this.services.toArray()
        };
    }
}
