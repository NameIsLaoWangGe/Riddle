import UIMain_Gongzhu from "./UIMain_Gongzhu";
import { lwg } from "../Lwg_Template/lwg";
export default class UIMain_Rival extends UIMain_Gongzhu {
    notCommon(): void {
    }

    /**骨骼动画*/
    createskeleton(): void {
        // 两个不同的情敌中随机选择一个
        let num = Math.floor(Math.random() * 2);
        this.skeleton = lwg.Sk.qingdi_01Tem.buildArmature(0);
        this.self.addChild(this.skeleton);
        // this.skScale = 0.9;
        // this.skeleton.scale(this.skScale, this.skScale);
        this.skeleton.x = this.self.width / 2;
        this.skeleton.y = this.self.height - 10;
        let pic = this.self.getChildByName('pic') as Laya.Sprite;
        pic.visible = false;
        this.skeleton.play(lwg.Enum.gongzhuAni.walk, true);
    }

    onTriggerEnter(other, self) {
        if (!lwg.Global._gameStart) {
            return;
        }
        switch (other.label) {
            case 'wall':
                this.wallAndPerson(other, self);
                break;

            case 'floor':
                this.floorAndPerson(other, self);
                break;

            case 'ladder':
                this.ladderAndPerson(other, self);
                break;

            case 'aisle':
                this.aisleAndPerson(other, self);
                break;

            case 'wangzi':
                this.wangziAndPerson(other, self);
                break;
            default:
                break;
        }
    }

    wangziAndPerson(other, self): void {
        lwg.Global._gameStart = false;
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        this.targetP.x = this.self.x;
        this.targetP.y = this.self.y;

        otherOwner['UIMain_Wangzi'].skeleton.play(lwg.Enum.wangziAni.win, true);
        let gz = this.selfScene['UIMain'].Gongzhu;
        if (gz['UIMain_Gongzhu'].necklace) {
            gz['UIMain_Gongzhu'].skeleton.play(lwg.Enum.gongzhuAni.die_xianglian, false);
        } else {
            gz['UIMain_Gongzhu'].skeleton.play(lwg.Enum.gongzhuAni.die, false);
        }

        this.skeleton.play(lwg.Enum.gongzhuAni.win, true);

        // 延时出现失败界面
        Laya.timer.frameOnce(100, this, f => {
            this.selfScene['UIMain'].victory = false;
            lwg.Admin._openScene('UIPassHint', null, null, f => {
                lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = lwg.Admin.SceneName.UIDefeated;
            });

        });
    }
}