import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_Follow extends lwg.Admin.Object {
    /**骨骼动画*/
    public skeleton: Laya.Skeleton;
    /**初始位置*/
    private firstPos: Laya.Point = new Laya.Point();
    constructor() { super(); }

    lwgInit() {
        this.self = this.owner as Laya.Sprite;
        let parent = this.self.parent as Laya.Image;
        // 设置y轴的高度
        this.firstPos.y = this.self.y;
        this.firstPos.x = this.self.x;
    }

    /**狗的骨骼动画*/
    createskeleton_StaticDog() {
        this.skeleton = lwg.Sk.gouTem.buildArmature(0);
        this.self.addChild(this.skeleton);
        this.skeleton.x = this.self.width / 2;
        this.skeleton.y = this.self.height - 5;
        let pic = this.self.getChildByName('pic') as Laya.Sprite;
        pic.visible = false;
        this.skeleton.play(lwg.Enum.dogAni.standby, true);
    }

    onUpdate(): void {
        if (this.self.name !== 'Person') {
            this.self.x = this.firstPos.x;
            this.self.y = this.firstPos.y;
        }
    }

    onDisable(): void {
    }
}