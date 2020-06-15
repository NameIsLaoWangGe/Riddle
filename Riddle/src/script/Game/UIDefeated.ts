import { lwg } from "../Lwg_Template/lwg";
export default class UIDefeated extends lwg.Admin.Scene {
    /**重来来按钮*/
    private BtnAgain: Laya.Image;
    /**下一关按钮*/
    private BtnLast: Laya.Image;
    /**金币资源数量*/
    private GoldRes: Laya.Sprite;
    /**分享按钮*/
    private BtnShare: Laya.Sprite;
    /**获取体力开始按钮*/
    private BtnExAdv: Laya.Sprite;
    /**关卡数量*/
    private LvNum: Laya.FontClip;
    constructor() { super(); }

    lwgInit(): void {
        this.self = this.owner as Laya.Scene;
        this.BtnAgain = this.self['BtnAgain'];
        this.BtnLast = this.self['BtnLast'];
        this.BtnShare = this.self['BtnShare'];
        this.BtnExAdv = this.self['BtnExAdv'];
        this.LvNum = this.self['LvNum'];
        this.LvNumDisplay();

        // lwg.PalyAudio.playSound(lwg.Enum.voiceUrl.defeated, 1);
    }
    adaptive(): void {
        this.self['sceneContent'].y = Laya.stage.height / 2;
    }

    /**关卡数显示，有两种情况，一种是显示当前真实关卡，一种是重玩以前的关卡*/
    LvNumDisplay(): void {
        if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
            this.LvNum.value = lwg.Global._gameLevel.toString();
        } else {
            this.LvNum.value = lwg.Admin.openLevelNum.toString();
        }
    }

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.BtnAgain, this, null, null, this.BtnAgainUp, null);
        lwg.Click.on('largen', null, this.BtnLast, this, null, null, this.BtnLastUp, null);
        lwg.Click.on('largen', null, this.BtnShare, this, null, null, this.BtnShareUp, null);
        lwg.Click.on('largen', null, this.BtnExAdv, this, null, null, this.BtnExAdvUp, null);
    }
    BtnAgainUp(event): void {
        event.currentTarget.scale(1, 1);
        if (lwg.Global._execution < 2) {
            lwg.Admin._openScene('UIExecutionHint', null, null, null);
        } else {
            lwg.Global._execution -= 2;
            lwg.LocalStorage.addData();
            lwg.Admin._refreshScene();
        }
    }
    BtnLastUp(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Global._createHint(lwg.Enum.HintType.noAdv);
    }
    BtnShareUp(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Global._createHint(lwg.Enum.HintType.noShare);
    }
    BtnExAdvUp(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Global._createHint(lwg.Enum.HintType.noAdv);
    }

    onDisable(): void {
    }
}