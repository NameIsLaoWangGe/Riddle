import { lwg } from "../Lwg_Template/lwg";
import UIMain_Gongzhu from "./UIMain_Gongzhu";
export default class UIMain_Houma extends UIMain_Gongzhu {
    createskeleton(): void {
        this.skeleton = lwg.Sk.houmaTem.buildArmature(0);
        this.self.addChild(this.skeleton);
        this.skeleton.x = this.self.width / 2;
        this.skeleton.y = this.self.height - 8;
        let pic = this.self.getChildByName('pic') as Laya.Sprite;
        pic.visible = false;
        let apple = this.self.getChildByName('apple') as Laya.Sprite;
        apple.visible = false;
        this.skeleton.play(lwg.Enum.gongzhuAni.walk, true);
    }
    notCommon() {
        this.signSkin = 'Room/icon_plaint.png';
    }

    onTriggerEnter(other, self): void {
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
            default:
                break;
        }
    }

    move(): void {
        if (this.attackSwitch) {
            this.rig.setVelocity({ x: 0, y: 0 });
            return;
        }
        if (this.moveDirection === lwg.Enum.PersonDir.left) {
            this.rig.setVelocity({ x: -this.speed, y: 0 });
            this.skeleton.scaleX = -1;
            let apple = this.self.getChildByName('apple') as Laya.Image;
            apple.x = -2;
        } else if (this.moveDirection === lwg.Enum.PersonDir.right) {
            this.rig.setVelocity({ x: this.speed, y: 0 });
            this.skeleton.scaleX = 1;
            let apple = this.self.getChildByName('apple') as Laya.Image;
            apple.x = 55;
        } else if (this.moveDirection === lwg.Enum.PersonDir.up) {
            this.rig.setVelocity({ x: 0, y: -6 });

        } else if (this.moveDirection === lwg.Enum.PersonDir.down) {
            this.rig.setVelocity({ x: 0, y: 6 });
        }
    }

    GameOver(): void{
        this.gameOverMove();
    };
}