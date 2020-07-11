import { lwg } from "../Lwg_Template/lwg";
import UIStart from "./UIStart";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UIXDpifu extends lwg.Admin.Scene {
    /**内容*/
    private SceneContent: Laya.Sprite;
    /**内容*/
    private background: Laya.Sprite;
    /**返回按钮*/
    private BtnBack: Laya.Sprite;
    /**看广告按钮*/
    private BtnGet: Laya.Sprite;
    /**logo*/
    private logo: Laya.Sprite;
    /**中间角色*/
    private person: Laya.Sprite;

    constructor() { super(); }

    selfVars(): void {
        this.BtnBack = this.self['BtnBack'];
        this.BtnGet = this.self['BtnGet'];
        this.SceneContent = this.self['SceneContent'];
        this.background = this.self['background'];
        this.logo = this.self['logo'];
    }

    lwgInit(): void {
        lwg.Global._openXD = true;
        lwg.Global.GoldNumNode.alpha = 0;
        lwg.Global.ExecutionNumNode.alpha = 0;
        ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_limitskin');
        ADManager.TAPoint(TaT.BtnShow, 'close_limitskin');
        this.btnGetNum();
    }

    adaptive(): void {
        this.SceneContent.y = Laya.stage.height * 0.528;
        this.self['background_01'].height = Laya.stage.height;
    }
    /**开场动画回调*/
    openAniFunc(): void {
    }

    /**按钮上点击次数显示*/
    btnGetNum(): void {
        let num = this.BtnGet.getChildByName('Num') as Laya.Label;
        num.text = '(' + lwg.Global._watchAdsNum + '/' + 3 + ')';
    }

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.BtnBack, this, null, null, this.btnBackUp, null);
        lwg.Click.on('largen', null, this.BtnGet, this, null, null, this.btnGetUp, null);
    }

    /**返回按钮抬起*/
    btnBackUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'close_limitskin');
        event.currentTarget.scale(1, 1);
        this.self.close();
    }

    /**看广告按钮抬起*/
    btnGetUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_limitskin');
        event.currentTarget.scale(1, 1);

        ADManager.ShowReward(() => {
            this.btnGetFunc();
        })
    }

    /**看完广告的返回函数*/
    btnGetFunc(): void {
        lwg.Global._watchAdsNum += 1;
        this.btnGetNum();
        if (lwg.Global._watchAdsNum >= 3) {
            lwg.Global._havePifu.push('09_aisha');
            lwg.Global._currentPifu = lwg.Enum.PifuAllName[8];
            this.self.close();
            lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].self['BtnXD'].removeSelf();
            lwg.Global._createHint_01(lwg.Enum.HintType.getXD);
        }
        lwg.LocalStorage.addData();
    }
    lwgOnUpdta(): void {
    }
    lwgDisable(): void {
        lwg.Global._openXD = false;
        lwg.Global.GoldNumNode.alpha = 1;
        lwg.Global.ExecutionNumNode.alpha = 1;
    }
}