import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";
import RecordManager from "../../TJ/RecordManager";
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
        // this.BtnExAdv = this.self['BtnExAdv'];
        this.LvNum = this.self['LvNum'];
        this.LvNumDisplay();
        // lwg.PalyAudio.playSound(lwg.Enum.voiceUrl.defeated, 1);

        lwg.Global._createGoldNum(this.self);
        lwg.Global._createExecutionNum(this.self);
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
        ADManager.TAPoint(TaT.BtnShow, 'Share_success');
        ADManager.TAPoint(TaT.BtnShow, 'returnword_fail');
        ADManager.TAPoint(TaT.BtnShow, 'ADticketbt_fail');
        ADManager.TAPoint(TaT.BtnShow, 'Share_fail');

        lwg.Click.on('largen', null, this.BtnAgain, this, null, null, this.btnAgainUp, null);
        lwg.Click.on('largen', null, this.BtnLast, this, null, null, this.btnLastUp, null);
        lwg.Click.on('largen', null, this.BtnShare, this, null, null, this.btnShareUp, null);
        lwg.Click.on('largen', null, this.self['BtnBack'], this, null, null, this.btnBackUp, null);
    }

    btnAgainUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'returnword_fail');

        event.currentTarget.scale(1, 1);
        if (lwg.Global._execution < 2) {
            lwg.Global.intoBtn = 'BtnAgain';
            lwg.Admin._openScene('UIExecutionHint', null, null, null);
        } else {

            lwg.Global._execution -= 2;
            lwg.Global._createHint_01(lwg.Enum.HintType.consumeEx);
            lwg.Global.createConsumeEx(null);
            lwg.LocalStorage.addData();

            lwg.Admin._refreshScene();
        }
        this.self.close();
    }

    // 看广告下一关
    btnLastUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADnextbt_fail');
        event.currentTarget.scale(1, 1);
        if (lwg.Global._execution < 2) {
            lwg.Admin._openScene('UIExecutionHint', null, null, null);
            lwg.Global.intoBtn = 'BtnLast';
            this.self.close();

        } else {
            ADManager.ShowReward(() => {
                this.btnLastUpFunc();
            })
        }
    }

    btnLastUpFunc(): void {

        if (Number(this.LvNum.value) >= 3) {
            lwg.Admin._openScene('UIPassHint', null, null, f => {
                lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].afterDefeated = true;
            });
        } else {
            lwg.Global._execution -= 2;
            lwg.Global._createHint_01(lwg.Enum.HintType.consumeEx);
            lwg.Global.createConsumeEx(null);
            lwg.LocalStorage.addData();

            lwg.LocalStorage.addData();
            if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                lwg.Admin._closeCustomScene();
                lwg.Global._gameLevel++;
                lwg.Admin._openGLCustoms();
            } else {
                lwg.Admin._closeCustomScene();
                lwg.Admin.openLevelNum++;
                lwg.Admin._openLevelNumCustom();
            }
        }
        this.self.close();
        // console.log(lwg.Admin.openLevelNum, lwg.Global._gameLevel);
        lwg.LocalStorage.addData();
    }

    // 分享
    btnShareUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'Share_fail');

        event.currentTarget.scale(1, 1);
        RecordManager._share(() => {
            this.btnShareUpFunc();
        })
    }

    btnShareUpFunc(): void {
        // 分享可以获得奖励
        lwg.Global._goldNum += 125;
    }

    btnBackUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADticketbt_fail');

        lwg.Admin._openScene('UIStart', null, null, null);
        lwg.Admin._closeCustomScene();
        lwg.Global._goldNum += 25;
        lwg.LocalStorage.addData();
        this.self.close();
        // event.currentTarget.scale(1, 1);
        // ADManager.ShowReward(() => {
        //     this.btnExAdvUpFunc();
        // })
    }
    btnExAdvUpFunc(): void {
        lwg.Global._execution += 3;
        let num = lwg.Global.ExecutionNumNode.getChildByName('Num') as Laya.FontClip;
        num.value = (Number(num.value) + 3).toString();
        lwg.LocalStorage.addData();
    }

    onDisable(): void {
    }
}