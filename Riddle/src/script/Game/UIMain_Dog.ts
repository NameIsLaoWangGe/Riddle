import { lwg } from "../Lwg_Template/lwg";
import UIMain_Gongzhu from "./UIMain_Gongzhu";

export default class Dog extends UIMain_Gongzhu {
    /** @prop {name:speed,tips:"狗的移动速度",type:float,default:2.1}*/
    speed: number;
    eatFood: boolean = false;

    notCommon(): void {
        this.signSkin = 'Room/icon_plaint.png';
    }
    /**骨骼动画*/
    createskeleton(): void {
        this.skeleton = lwg.Sk.gouTem.buildArmature(0);
        this.self.addChild(this.skeleton);
        this.skeleton.x = this.self.width / 2;
        this.skeleton.y = this.self.height;
        this.skeleton.zOrder = 5;
        let pic = this.self.getChildByName('pic') as Laya.Sprite;
        pic.visible = false;
        this.skeleton.play(lwg.Enum.dogAni.walk, true);
    }

    onTriggerEnter(other, self): void {
        //根据碰撞物体作出相应行为
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
                // this.wallAndPerson(other, self);
                break;

            case 'doghouse':
                this.dogAndDoghouse(other, self);
                break;

            case 'dogfood':
                this.dogAnddogfood(other, self);
                break;

            default:
                break;
        }
    }

    /**狗和狗粮的碰撞*/
    dogAnddogfood(other, self): void {
        console.log('吃了狗粮变大了');
        let otherOnwer = other.owner as Laya.Sprite;
        let otherOnwerParent = otherOnwer.parent as Laya.Image;
        this.skeleton.play(lwg.Enum.dogAni.standby, true);
        this.eatFood = true;
        self.width += 60;
        self.x -= 35;
        this.self.x = otherOnwer.x + otherOnwerParent.x - otherOnwerParent.width / 2;
        other.owner.removeSelf();
        if (this.moveDirection === lwg.Enum.PersonDir.left) {
            this.skeleton.scale(1.5, 1.5);
        } else if (this.moveDirection === lwg.Enum.PersonDir.right) {
            this.skeleton.scale(-1.5, 1.5);
        }
    }

    /**狗和狗窝的碰撞*/
    dogAndDoghouse(other, self): void {
        this.self.removeSelf();
        let sleepPic = (other.owner as Laya.Sprite).getChildByName('sleepPic') as Laya.Image;
        sleepPic.visible = true;
    }

    /**狗的移动规则*/
    move() {
        // 是否是吃到狗粮的状态
        if (this.eatFood) {
            this.rig.setVelocity({ x: 0, y: 0 });
        } else {
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.rig.setVelocity({ x: -this.speed, y: 0 });
                this.skeleton.scaleX = 1;
                this.plaint.x = 20;
            } else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.rig.setVelocity({ x: this.speed, y: 0 });
                this.skeleton.scaleX = -1;
                this.plaint.x = 30;
            } else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                this.rig.setVelocity({ x: 0, y: -6 });

            } else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                this.rig.setVelocity({ x: 0, y: 6 });
            }
        }
    }

    onUpdate(): void {
        // console.log(this.moveDirection);
        if (!lwg.Global._gameStart) {
            this.rig.setVelocity({ x: 0, y: 0 });
            this.gameOverMove();
            return;
        }
        if (!this.speed) {
            this.speed = 2.1;
        }
        this.noMoveDirection();
        this.move();
        this.positionOffset();
        this.scopeControl();
    }
}