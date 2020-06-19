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
        RecordManager.stopAutoRecord();
        this.self = this.owner as Laya.Scene;
        this.BtnAgain = this.self['BtnAgain'];
        this.BtnLast = this.self['BtnLast'];
        this.BtnShare = this.self['BtnShare'];
        this.LvNum = this.self['LvNum'];
        this.LvNumDisplay();

        if (!lwg.Global._elect) {
            this.self['P201_01'].removeSelf();
            this.self['P201_02'].removeSelf();
        }
    }

    adaptive(): void {
        this.self['sceneContent'].y = Laya.stage.height / 2;
    }

    openAni(): void {
        this.self['BtnBack'].visible = false;
        setTimeout(() => {
            this.self['BtnBack'].visible = true;
        }, 3000);
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
        lwg.Click.on('largen', null, this.BtnLast, this, null, null, this.btnNextUp, null);
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
            let num = lwg.Global.ExecutionNumNode.getChildByName('Num') as Laya.FontClip;
            num.value = lwg.Global._execution.toString();
            lwg.Global._createHint_01(lwg.Enum.HintType.consumeEx);
            lwg.Global.createConsumeEx(null);
            lwg.LocalStorage.addData();

            lwg.Admin._refreshScene();
            this.self.close();
        }
    }

    // 看广告下一关
    btnNextUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADnextbt_fail');
        event.currentTarget.scale(1, 1);
        if (lwg.Global._execution < 2) {
            lwg.Admin._openScene('UIExecutionHint', null, null, null);
            lwg.Global.intoBtn = 'BtnLast';

        } else {
            ADManager.ShowReward(() => {
                this.btnNextUpFunc();
            })
        }
    }

    btnNextUpFunc(): void {
        if (Number(this.LvNum.value) >= 3) {
            lwg.Admin._openScene('UIPassHint', null, null, f => {
                lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].afterDefeated = true;
            });
        } else {
            lwg.Admin._nextCustomScene(2);
        }
        this.self.close();
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
        console.log('分享成功，只是没有奖励！');
    }

    btnBackUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADticketbt_fail');
        event.currentTarget.scale(1, 1);

        lwg.Admin._openScene('UIStart', null, null, null);
        lwg.Admin._closeCustomScene();
        lwg.Global._goldNum += 25;
        lwg.LocalStorage.addData();
        this.self.close();
    }

    onDisable(): void {
    }
}