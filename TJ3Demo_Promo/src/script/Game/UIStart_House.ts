import { lwg } from "../Lwg_Template/lwg";

export default class UIStart_House extends lwg.Admin.Object {
    constructor() { super(); }
    /**记录当前复制的那个房子的索引值*/
    private index;
    lwgInit(): void {
    }
    onDisable(): void {
    }
}