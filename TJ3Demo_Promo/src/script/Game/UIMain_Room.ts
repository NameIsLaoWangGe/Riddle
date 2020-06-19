import { lwg } from "../Lwg_Template/lwg";
import UIMain_Follow from "./UIMain_Follow";

export default class UIMain_Room extends Laya.Script {
    /** 指代当前脚本挂载的节点*/
    private self: Laya.Image;
    /**所属场景*/
    private selfScene: Laya.Scene;

    /**物理组件*/
    private rig: Laya.RigidBody;

    /**初始坐标*/
    fX;
    fY;

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.Image;
        this.selfScene = this.self.scene;
        this.self['UIMain_Room'] = this;
        this.rig = this.self.getComponent(Laya.RigidBody) as Laya.RigidBody;
        this.rig.setVelocity({ x: 0, y: 0 });
        this.fX = this.self.x;
        this.fY = this.self.y;
        this.btnOnClick();
        this.collisionNodeFollow();
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

    /**按钮事件注册*/
    btnOnClick(): void {
        lwg.Click.on('noEffect', null, this.self, this, this.houseDwon, null, null, null);
    }

    /**移动开关*/
    private _roomMove: boolean = false;
    /**房子的初始位置*/
    private _roomX: number;
    private _roomY: number;
    /**房子按下*/
    houseDwon(): void {
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
        lwg.Global._roomPickup = this.self;
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