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
    @Description("")
    public async list(): Promise<string> {
        return this.memcachedService.listTable();
    }

    @Command("memcached:create [name]")
    @Description("")
    public async create(
        @Param("name")
        name?: string
    ): Promise<void> {
        await this.memcachedService.create(name);
    }

    @Command("memcached:destroy <name>")
    @Description("")
    public async destroy(
        @Param("name")
        name: string,
        @Option("force", {
            type: "boolean",
            alias: "f",
            description: ""
        })
        force?: boolean,
        @Option("yes", {
            type: "boolean",
            alias: "y",
            description: ""
        })
        yes?: boolean
    ): Promise<void> {
        await this.memcachedService.destroy(name, force, yes);
    }

    @Command("memcached:start [name]")
    @Description("")
    public async start(
        @Param("name")
        name?: string,
        @Option("restart", {
            type: "boolean",
            alias: "r",
            description: ""
        })
        restart?: boolean
    ): Promise<void> {
        await this.memcachedService.start(name, restart);
    }

    @Command("memcached:stop [name]")
    @Description("")
    public async stop(
        @Param("name")
        name?: string
    ): Promise<void> {
        await this.memcachedService.stop(name);
    }
}
