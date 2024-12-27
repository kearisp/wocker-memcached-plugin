import {
    Injectable,
    Inject,
    DockerService,
    PLUGIN_DIR_KEY,
    FileSystem
} from "@wocker/core";
import {promptText, promptConfirm} from "@wocker/utils";
import CliTable from "cli-table3";

import {Config, ConfigProps} from "../makes/Config";
import {Service} from "../makes/Service";


@Injectable()
export class MemcachedService {
    protected _config?: Config;

    public constructor(
        protected readonly dockerService: DockerService,
        @Inject(PLUGIN_DIR_KEY)
        protected readonly pluginDir: string
    ) {}

    public get fs(): FileSystem {
        if(!this.pluginDir) {
            throw new Error("Plugin dir missing");
        }

        return new FileSystem(this.pluginDir);
    }

    public get config(): Config {
        if(!this._config) {
            const fs = this.fs;

            const data: ConfigProps = fs.exists("config.json")
                ? fs.readJSON("config.json")
                : {};

            this._config = new class extends Config {
                public save(): void {
                    if(!fs.exists("")) {
                        fs.mkdir("", {
                            recursive: true
                        });
                    }

                    fs.writeJSON("config.json", this.toObject());
                }
            }(data);
        }

        return this._config;
    }

    public async listTable(): Promise<string> {
        const table = new CliTable({
            head: [
                "Name"
            ]
        });

        for(const service of this.config.services.items) {
            table.push([
                service.name
            ]);
        }

        return table.toString();
    }

    public async create(name?: string) {
        if(!name || this.config.hasService(name)) {
            name = await promptText({
                message: "Service name:",
                validate: (name?: string) => {
                    if(!name) {
                        return "Mandatory";
                    }

                    if(this.config.hasService(name)) {
                        return "Service already exists";
                    }

                    return true;
                }
            }) as string;
        }

        const service = new Service({
            name
        });

        this.config.setService(service);
        this.config.save();
    }

    public async destroy(name: string, force?: boolean, yes?: boolean): Promise<void> {
        const service = this.config.getService(name);

        if(!force && service.name === this.config.default) {
            throw new Error("Can't destroy default service");
        }

        if(!yes) {
            const confirm = await promptConfirm({
                message: `Are you sure you want to delete the "${name}" service? This action cannot be undone and all data will be lost.`,
                default: false
            });

            if(!confirm) {
                throw new Error("Aborted");
            }
        }

        await this.dockerService.removeContainer(service.containerName);

        this.config.unsetService(name);
        this.config.save();
    }

    public async start(name?: string, restart?: boolean) {
        if(!name && !this.config.hasDefaultService()) {
            await this.create();
        }

        const service = this.config.getServiceOrDefault(name);

        let container = await this.dockerService.getContainer(service.containerName);

        if(restart && container) {
            await this.dockerService.removeContainer(service.containerName);

            container = null;
        }

        if(!container) {
            container = await this.dockerService.createContainer({
                name: service.containerName,
                image: "memcached:latest",
                restart: "always"
            });
        }

        const {
            State: {
                Running
            }
        } = await container.inspect();

        if(!Running) {
            await container.start();

            console.info(`Memcached service started at ${service.containerName}`);
        }
    }

    public async stop(name?: string) {
        const service = this.config.getServiceOrDefault(name);

        await this.dockerService.removeContainer(service.containerName);

        console.info(`Memcached service "${service.name}" stopped`);
    }

    public use(name?: string): string|void {
        if(!name) {
            const service = this.config.getDefaultService();

            return service.name;
        }

        const service = this.config.getService(name);

        this.config.default = service.name;
        this.config.save();
    }
}
