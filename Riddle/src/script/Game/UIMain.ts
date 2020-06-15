import { lwg } from "../Lwg_Template/lwg";

export default class UIMain extends lwg.Admin.Scene {
    constructor() {
        super();
    }
    /**主角*/
    Gongzhu: Laya.Sprite;
    /**王子*/
    Wangzi: Laya.Sprite;
    /**王子的父节点*/
    WAngziPrent: Laya.Image;
    /**重来按钮*/
    BtnAgain: Laya.Sprite;
    /**钥匙数量*/
    KeyNum: Laya.Sprite;
    /**最后一次被拾取的房间，用于被吸附到另一个房间*/
    _roomPickup: Laya.Image;
    lwgInit() {
        // 关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;
        this.BtnAgain = this.self['BtnAgain'];
        this.Wangzi = this.self['Wangzi'];
        this.KeyNum = this.self['KeyNum'];
        this.Gongzhu = this.self['Gongzhu'];

        lwg.Global._gameStart = true;
        if (lwg.Global._execution <= 0) {
            lwg.Global._execution = 0;
        }

        lwg.Global._createGoldNum(this.self);
        lwg.Global._createExecutionNum(this.self);
        lwg.Global._createBtnAgain(this.self);
        lwg.Global._createBtnPause(this.self);
        lwg.Global._createBtnHint(this.self);
    }

    /**刷新重来按钮*/
    BtnAgainUp(event): void {
        lwg.Admin._refreshScene();
    }

    onUpdate(): void {
    }

    onDisable(): void {
    }

}