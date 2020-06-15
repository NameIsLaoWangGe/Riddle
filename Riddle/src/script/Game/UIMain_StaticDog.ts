import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_StaticDog extends lwg.Admin.Object {
    /**骨骼动画*/
    public skeleton: Laya.Skeleton;
    lwgInit() {
        this.skeleton = lwg.Sk.gouTem.buildArmature(0);
        this.self.addChild(this.skeleton);
        this.skeleton.x = this.self.width / 2;
        this.skeleton.y = this.self.height;
        let pic = this.self.getChildByName('pic') as Laya.Sprite;
        pic.visible = false;
        if (pic.scaleX === -1) {
            this.skeleton.scaleX = -1;
        } else {
            this.skeleton.scaleX = 1;
        }
        this.skeleton.play(lwg.Enum.dogAni.standby, true);
        this.createPlaint();
    }
    /**创建感叹号*/
    plaint: Laya.Image;
    createPlaint(): void {
        let img = new Laya.Image();
        img.skin = 'Room/icon_plaint.png';
        img.y = -40;
        img.x = this.self.width / 2;
        this.self.addChild(img);
        img.zOrder = 10;
        this.plaint = img;
    }

    onDisable(): void {
    }
}