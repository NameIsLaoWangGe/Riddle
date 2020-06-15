import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_Gold extends Laya.Script3D {

    private self: Laya.MeshSprite3D;
    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.MeshSprite3D;
    }

    onTriggerEnter(other) {
        // console.log('3D碰撞必须继承Laya.Script3D！');
        lwg.Global._taskGoldNum++;
        this.self.removeSelf();
    }

    onDisable(): void {
    }

    onUpdate(): void {
        this.self.transform.localRotationEulerZ += 2;
    }
}