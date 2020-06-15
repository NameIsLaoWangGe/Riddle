import { lwg } from "../Lwg_Template/lwg";
import UIMain_Follow from "./UIMain_Follow";
export default class UIMain_Houzi extends lwg.Admin.Object {
    /** @prop {name:eatSpeed,tips:"吃香蕉的速度，速度越大，吃的越快",type:float,default:1}*/
    eatSpeed: number;
    /**骨骼动画*/
    skeleton: Laya.Skeleton;
    /**进度条遮罩*/
    Mask: Laya.Sprite;
    lwgInit(): void {
        this.createskeleton();
        let Progress = this.self.getChildByName('Progress');
        let ProgressBar = Progress.getChildByName('ProgressBar') as Laya.Image;
        this.Mask = ProgressBar.mask;
    }
    /**骨骼动画*/
    createskeleton(): void {
        this.skeleton = lwg.Sk.houziTem.buildArmature(0);
        this.self.addChild(this.skeleton);
        this.skeleton.x = this.self.width / 2;
        this.skeleton.y = this.self.height;
        let pic = this.self.getChildByName('pic') as Laya.Sprite;
        pic.visible = false;
        this.skeleton.play(lwg.Enum.dogAni.standby, true);
        // console.log(this.skeleton);
    }

    /**创建一个香蕉皮*/
    createBanana(): void {
        let banana: Laya.Sprite;
        let self = this.self;
        let parent1 = this.self.parent;
        Laya.loader.load('prefab/banana.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
            let _prefab = new Laya.Prefab();
            _prefab.json = prefab;
            banana = Laya.Pool.getItemByCreateFun('banana', _prefab.create, _prefab);
            parent1.addChild(banana);
            banana.pos(self.x, self.y + 4);
            banana.addComponent(UIMain_Follow);
            self.visible = false;
            // console.log(banana);
        }));
    }
    timeSwitch: boolean = true;
    onUpdate(): void {
        if (this.timeSwitch && lwg.Global._gameLevel) {
            if (this.Mask.x > -78) {
                if (!this.eatSpeed) {
                    this.eatSpeed = 1;
                }
                this.Mask.x -= this.eatSpeed * 0.1;
            } else {
                this.timeSwitch = false;
                console.log('丢下香蕉');
                this.createBanana();
            }
        }

    }
}