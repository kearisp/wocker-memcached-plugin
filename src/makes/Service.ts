import {
    Config,
    ConfigProperties
} from "@wocker/core";


export type ServiceProps = ConfigProperties & {
    imageName?: string;
    imageVersion?: string;
};

export class Service extends Config<ServiceProps> {
    public imageName: string;
    public imageVersion: string;

    public constructor(props: ServiceProps) {
        super(props);

        const {
            imageName = "memcached",
            imageVersion = "latest"
        } = props;

        this.imageName = imageName;
        this.imageVersion = imageVersion;
    }

    public get containerName(): string {
        return `memcached-${this.name}.ws`;
    }

    public get imageTag(): string {
        return `${this.imageName}:${this.imageVersion}`;
    }
}
