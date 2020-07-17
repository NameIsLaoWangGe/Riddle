import { lwg } from "../Lwg_Template/lwg";
import UIMain_Gongzhu from "./UIMain_Gongzhu";

export default class UIMain_Wangzi extends UIMain_Gongzhu {
    /**公主所在的房间是否和王子所在的房间连接了*/
    gzConnect: boolean;
    notCommon(): void {
        this.gzConnect = false;
        this.signSkin = 'Room/icon_love.png';
    }
    createskeleton(): void {
        this.skeleton = lwg.Sk.wangziTem.buildArmature(0);
        this.self.addChild(this.skeleton);
        this.skeleton.x = this.self.width / 2;
        this.skeleton.y = this.self.height - 14;
        let pic = this.self.getChildByName('pic') as Laya.Sprite;
        pic.visible = false;
        if (pic.scaleX === -1) {
            this.skeleton.scaleX = 1;
        } else {
            this.skeleton.scaleX = -1;
        }
        this.skeleton.play(lwg.Enum.wangziAni.standby, true);
        // console.log(this.skeleton);
        this.createParachute();
    }

    onTriggerEnter(other, self): void {
        if (!lwg.Global._gameStart) {
            return;
        }
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

            default:
                break;
        }
    }

    /**动作切换器*/
    aniSwitch: boolean = false;
    /**角色的移动规则*/
    move() {
        if (!this.gzConnect) {
            if (this.aniSwitch) {
                this.skeleton.play(lwg.Enum.wangziAni.standby, true);
                this.aniSwitch = false;
            }
            this.rig.setVelocity({ x: 0, y: 0 });
            return;
        }

        if (!this.aniSwitch) {
            this.skeleton.play(lwg.Enum.wangziAni.walk, true);
            this.aniSwitch = true;
        }

        if (this.moveDirection === lwg.Enum.PersonDir.left) {
            this.rig.setVelocity({ x: -2.5, y: 0 });
            this.skeleton.scaleX = -1;
        } else if (this.moveDirection === lwg.Enum.PersonDir.right) {
            this.rig.setVelocity({ x: 2.5, y: 0 });
            this.skeleton.scaleX = 1;
        } else if (this.moveDirection === lwg.Enum.PersonDir.up) {
            this.rig.setVelocity({ x: 0, y: -6 });

        } else if (this.moveDirection === lwg.Enum.PersonDir.down) {
            this.rig.setVelocity({ x: 0, y: 6 });
        }
    }

    lwgOnUpdate(): void {
        if (!lwg.Global._gameStart) {
            this.GameOver();
            return;
        }
        let necklace = this.self.scene['UIMain'].Gongzhu['UIMain_Gongzhu'].necklace;
        if (necklace) {
            this.noMoveDirection();
            this.move();
            this.scopeControl();
        }
        this.positionOffset();
    }
}