import {Image} from "@wocker/utils";


export type ServiceProps = {
    name: string;
    image?: string;
    /** @deprecated */
    imageName?: string;
    /** @deprecated */
    imageVersion?: string;
};

export class Service {
    public name: string;
    protected _image: string;

    public constructor(props: ServiceProps) {
        const {
            name,
            imageName = "memcached",
            imageVersion,
            image = imageName && imageVersion ? `${imageName}:${imageVersion}` : imageName
        } = props;

        this.name = name;
        this._image = image;
    }

    public get containerName(): string {
        return `memcached-${this.name}.ws`;
    }

    public get image(): string {
        return this._image;
    }

    public set image(image: string) {
        if(!Image.isValid(image)) {
            throw new Error(`Invalid image ${image}`);
        }

        this._image = image;
    }

    public toObject(): ServiceProps {
        return {
            name: this.name,
            image: this.image
        };
    }
}
