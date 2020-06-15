import { lwg } from "../Lwg_Template/lwg";

export default class UIVictory extends lwg.Admin.Scene {
    /**领取奖励按钮*/
    BtnGet: Laya.Sprite;
    /**过关显示*/
    AccordingLv: Laya.Sprite;
    /**获得金币*/
    GetGold: Laya.Sprite;
    /**三倍领取*/
    BtnGoldAdv: Laya.Sprite;
    /**看广告领取体力*/
    BtnExAdv: Laya.Sprite;
    /**关卡数量*/
    LvNum: Laya.FontClip;
    /**下一关*/
    BtnLast: Laya.Sprite;

    constructor() { super(); }

    lwgInit(): void {
        this.BtnGoldAdv = this.self['BtnGoldAdv'];
        this.BtnExAdv = this.self['BtnExAdv'];
        this.GetGold = this.self['GetGold'];
        this.LvNum = this.self['LvNum'];
        this.LvNum.value = lwg.Global._gameLevel.toString();
        this.BtnLast = this.self['BtnLast'];
        lwg.Global._createGoldNum(this.self);
        lwg.Global._createExecutionNum(this.self);
        this.getGoldDisplay();
        this.LvNumDisplay();

        lwg.PalyAudio.playSound(lwg.Enum.voiceUrl.victory, 1);
    }

    adaptive(): void {
        this.self['sceneContent'].y = Laya.stage.height / 2;
    }

    /**本关获得金币显示,此时并未获得*/
    getGoldDisplay(): void {
        let getLebel = this.GetGold.getChildByName('Num') as Laya.FontClip;
        let level = lwg.Global._gameLevel;
        getLebel.value = 'x' + 25;
        console.log('普通关卡奖励金币为：' + getLebel.value);
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
        lwg.Click.on('largen', null, this.BtnLast, this, null, null, this.btnLastUp, null);
        lwg.Click.on('largen', null, this.BtnGoldAdv, this, null, null, this.BtnGoldAdvUp, null);
        lwg.Click.on('largen', null, this.BtnExAdv, this, null, null, this.BtnExAdvUp, null);
    }

    /**需要判断当前的关卡是否和当前关卡相等，不相等说明打开的是以前的关卡*/
    btnLastUp() {
        lwg.Admin._closeScene();
        lwg.Admin.openLevelNum++;

        if (lwg.Global._execution < 2) {
            lwg.Admin._openScene('UIExecutionHint', null, null, null);
        } else {
            lwg.Global._execution -= 2;
            lwg.LocalStorage.addData();
            if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                lwg.Global._gameLevel++;
                lwg.Admin._openCustomsScene();
            } else {
                lwg.Admin._openNumCustomsScene();
            }
        }
        console.log(lwg.Admin.openLevelNum, lwg.Global._gameLevel);
        lwg.Global._goldNum += 25;
        lwg.LocalStorage.addData();
    }

    BtnGoldAdvUp(event): void {
        event.currentTarget.scale(1, 1);
        // let getLebel = this.GetGold.getChildByName('Num') as Laya.Label;
        // lwg.Global._goldNum += Number(getLebel.text);
        // lwg.Admin._openScene('UIStart', 2, this.self, null);
        lwg.Global._createHint(lwg.Enum.HintType.noAdv);
    }

    BtnExAdvUp(event): void {
        event.currentTarget.scale(1, 1);
        // lwg.Admin._openScene('UISet', 2, null, null);
        lwg.Global._createHint(lwg.Enum.HintType.noAdv);
    }

    onDisable(): void {
    }
}