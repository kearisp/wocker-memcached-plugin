import {
    Plugin
} from "@wocker/core";

import {MemcachedController} from "./controller/MemcachedController";
import {MemcachedService} from "./services/MemcachedService";


@Plugin({
    name: "memcached",
    controllers: [
        MemcachedController
    ],
    providers: [
        MemcachedService
    ]
})
export default class MemcachedPlugin {}
