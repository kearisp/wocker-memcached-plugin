export type ServiceProps = {
    name: string;
    imageName?: string;
    imageVersion?: string;
};

export class Service {
    public name: string;
    public imageName: string;
    public imageVersion?: string;

    public constructor(props: ServiceProps) {
        const {
            name,
            imageName = "memcached",
            imageVersion
        } = props;

        this.name = name;
        this.imageName = imageName;
        this.imageVersion = imageVersion;
    }

    public get containerName(): string {
        return `memcached-${this.name}.ws`;
    }

    public get imageTag(): string {
        if(!this.imageVersion) {
            return this.imageName;
        }

        return `${this.imageName}:${this.imageVersion}`;
    }

    public toObject(): ServiceProps {
        return {
            name: this.name,
            imageName: this.imageName,
            imageVersion: this.imageVersion
        };
    }
}
