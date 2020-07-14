import { lwg, EventAdmin } from "../Lwg_Template/lwg";
import UIMain_Follow from "./UIMain_Follow";

export default class UIMain_Room extends lwg.Admin.Object {
    /**初始坐标*/
    fX;
    fY;
    constructor() { super(); }

    lwgInit(): void {
        this.self.pivotX = this.self.width / 2;
        this.self.pivotY = this.self.height / 2;
        this.self['UIMain_Room'] = this;
        this.rig = this.self.getComponent(Laya.RigidBody) as Laya.RigidBody;
        this.rig.setVelocity({ x: 0, y: 0 });
        this.fX = this.self.x;
        this.fY = this.self.y;
        this.collisionNodeFollow();
        this.boxColliderSet();
        this.wallpaperSet();

    }

    /**房间碰撞框格式设置*/
    boxColliderSet(): void {
        let boxCol = this.self.getComponent(Laya.BoxCollider) as Laya.BoxCollider;
        boxCol.width = this.self.width - 6;
        boxCol.height = this.self.height - 6;
        boxCol.x = 3;
        boxCol.y = 3;
    }

    /**墙纸设置*/
    wallpaperSet(): void {
        let wallpaper = this.self.getChildByName('wallpaper') as Laya.Sprite;
        if (wallpaper) {
            wallpaper.removeSelf();
        }
        let wallpaper0 = new Laya.Sprite();
        wallpaper0.loadImage(lwg.Enum.WallpaperSkin[lwg.Enum.RoomSkinZoder[(this.self as Laya.Image).skin]]);
        this.self.addChild(wallpaper0);
        wallpaper0.zOrder = -5;
        wallpaper0.pos(15.5, 0);
        wallpaper0.height = 50;
        wallpaper0.y = this.self.height - 50 - 15.5;

        let mask = new Laya.Sprite();
        mask.loadImage(lwg.Enum.WallpaperSkin[lwg.Enum.RoomSkinZoder[(this.self as Laya.Image).skin]]);
        wallpaper0.mask = mask;
        mask.width = this.self.width - 30;
        mask.height = 200;
        mask.y = -10;
    }


    /**
     * 为带有物理的节点添加移动脚本
     * 防止重复添加
     * */
    collisionNodeFollow(): void {
        for (let index = 0; index < this.self.numChildren; index++) {
            const child = this.self.getChildAt(index) as Laya.Sprite;
            let rig = child.getComponent(Laya.RigidBody);
            if (rig) {
                let followScript = child.getComponent(UIMain_Follow);
                if (!followScript) {
                    child.addComponent(UIMain_Follow);
                }
            }
        }
    }

    onTriggerEnter(other, self) {
        // console.log(other.owner.name);
        // console.log(other.owner.name);
    }
    onTriggerStay() {
        // console.log('碰撞持续中！');
    }

    btnOnClick(): void {
        lwg.Click.on('noEffect', null, this.self, this, this.houseDwon, null, null, null);
    }

    /**移动开关*/
    private _roomMove: boolean = false;
    /**房子的初始位置*/
    private _roomX: number;
    private _roomY: number;
    /**房子按下*/
    houseDwon(e: Laya.Event): void {
        if (!lwg.Global._gameStart) {
            return;
        }
        // 第一关的新手引导中，第二个房间不可以移动
        if (lwg.Global._gameLevel === 1 && this.self.name === 'Room2') {
            return;
        }
        this._roomX = this.self.x;
        this._roomY = this.self.y;
        this._roomMove = true;
        lwg.Global._roomPickup = this.self as Laya.Image;
    }
    /**点击到舞台的初始位置*/
    private _stageX: number;
    private _stageY: number;
    onStageMouseDown(e: Laya.Event) {
        if (!this._stageX && !this._stageY) {
            this._stageX = e.stageX;
            this._stageY = e.stageY;
        }
    }
    /**记录当前滑动屏幕的偏移量*/
    private diffX: number = null;
    private diffY: number = null;
    onStageMouseMove(e: Laya.Event) {
        if (this._roomMove) {
            this.diffX = e.stageX - this._stageX;
            this.diffY = e.stageY - this._stageY;
            this.self.x = this._roomX + this.diffX;
            this.self.y = this._roomY + this.diffY;
        }
    }
    onStageMouseUp() {
        this.selfScene['UIMain'].currentRoom = null;
        this._roomMove = false;
        this._roomX = null;
        this._roomY = null;
        this._stageX = null;
        this._stageY = null;
        this.diffX = null;
        this.diffY = null;
    }

    onUpdate(): void {
        // 第一关的新手引导中，第二个房间不可以移动
        if (lwg.Global._gameLevel === 1 && this.self.name === 'Room2') {
            this.self.x = this.fX;
            this.self.y = this.fY;
            return;
        }
    }

    onDisable(): void {
    }
}