import {
    Config,
    ConfigProperties
} from "@wocker/core";


export type ServiceProps = ConfigProperties & {};

export class Service extends Config<ServiceProps> {
    public constructor(props: ServiceProps) {
        super(props);

        const {

        } = props;
    }

    public get containerName(): string {
        return `memcached-${this.name}.ws`;
    }
}
