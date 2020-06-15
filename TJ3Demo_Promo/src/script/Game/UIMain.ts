import { lwg } from "../Lwg_Template/lwg";
import RecordManager from "../../TJ/RecordManager";
import ADManager, { TaT } from "../../TJ/Admanager";

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
    /**本关是胜利还是失败*/
    victory: boolean;
    lwgInit() {

        ADManager.TAPoint(TaT.LevelStart, this.self.name);

        RecordManager.startAutoRecord();
        // 关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;
        this.BtnAgain = this.self['BtnAgain'];
        this.Wangzi = this.self['Wangzi'];
        this.KeyNum = this.self['KeyNum'];
        this.Gongzhu = this.self['Gongzhu'];

        lwg.Global._gameStart = true;

        // lwg.Global._createGoldNum(this.self);
        // lwg.Global._createExecutionNum(this.self);

        lwg.Global._createBtnAgain(this.self);
        lwg.Global._createBtnPause(this.self);
        lwg.Global._createBtnHint(this.self);
        // lwg.Global._createP201_01(this.self);

    }

    btnOnClick(): void {
        this.self.on(Laya.Event.DOUBLE_CLICK, this, this.stageDB);
    }
    stageDB(): void {
        if (lwg.Global._freetHint) {
            console.log('免费提示出现！');
            lwg.Global._freeHintTime = (new Date).getDate();
            lwg.Global._freetHint = false;
            lwg.LocalStorage.addData();
            lwg.Admin._openScene('UIPassHint', null, null, f => {
                lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = 'UIMain';
                lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].setStyle();
            });
        }
    }

    lwgDisable(): void {
        if (this.victory) {
            ADManager.TAPoint(TaT.LevelFinish, this.self.name);
        } else {
            ADManager.TAPoint(TaT.LevelFail, this.self.name);
        }
    }

}