import {
    Controller,
    Description,
    Command,
    Param,
    Option
} from "@wocker/core";

import {MemcachedService} from "../services/MemcachedService";


@Controller()
export class MemcachedController {
    public constructor(
        protected readonly memcachedService: MemcachedService
    ) {}

    @Command("memcached:ls")
    @Description("Lists all Memcached services in a table format.")
    public async list(): Promise<string> {
        return this.memcachedService.listTable();
    }

    @Command("memcached:create [name]")
    @Description("Creates a Memcached service with the specified name.")
    public async create(
        @Param("name")
        name?: string
    ): Promise<void> {
        await this.memcachedService.create(name);
    }

    @Command("memcached:destroy <name>")
    @Description("Destroys a Memcached service by name, with optional confirmation flags.")
    public async destroy(
        @Param("name")
        name: string,
        @Option("force", {
            type: "boolean",
            alias: "f",
            description: "Force destruction"
        })
        force?: boolean,
        @Option("yes", {
            type: "boolean",
            alias: "y",
            description: "Skip confirmation"
        })
        yes?: boolean
    ): Promise<void> {
        await this.memcachedService.destroy(name, force, yes);
    }

    @Command("memcached:start [name]")
    @Description("Starts a Memcached service by name, with an option to restart it if it's already running.")
    public async start(
        @Param("name")
        name?: string,
        @Option("restart", {
            type: "boolean",
            alias: "r",
            description: "Restart the service if it is already running"
        })
        restart?: boolean
    ): Promise<void> {
        await this.memcachedService.start(name, restart);
    }

    @Command("memcached:stop [name]")
    @Description("Stops a running Memcached service by its name. If no name is provided, stops the default service.")
    public async stop(
        @Param("name")
        name?: string
    ): Promise<void> {
        await this.memcachedService.stop(name);
    }

    @Command("memcached:use [name]")
    @Description("Sets a specified Memcached service as the default or retrieves the current default service name if no service is specified.")
    public use(
        @Param("name")
        name?: string
    ): string|void {
        return this.memcachedService.use(name);
    }
}
