import { lwg } from "../Lwg_Template/lwg";
import UIStart from "./UIStart";
import ADManager from "../../TJ/Admanager";

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

    lwgInit(): void {
        lwg.Global._stageClick = false;
        lwg.Global.GoldNumNode.alpha = 0;
        lwg.Global.ExecutionNumNode.alpha = 0;
        this.BtnBack = this.self['BtnBack'];
        this.BtnGet = this.self['BtnGet'];
        this.SceneContent = this.self['SceneContent'];
        this.background = this.self['background'];
        this.logo = this.self['logo'];

        this.btnGetNum();
    }

    adaptive(): void {
        this.SceneContent.y = Laya.stage.height * 0.528;
        this.self['background_01'].height = Laya.stage.height;
    }
    openAni(): void {

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
        event.currentTarget.scale(1, 1);
        lwg.Admin._openScene(lwg.Admin.SceneName.UIStart, null, null, f => {
            console.log(lwg.Admin._sceneControl)
        });
        this.self.close();
    }

    /**看广告按钮抬起*/
    btnGetUp(event): void {
        event.currentTarget.scale(1, 1);

        // ADManager.ShowReward(() => {
        this.btnGetFunc();
        // })
    }

    /**看完广告的返回函数*/
    btnGetFunc(): void {
        lwg.Global._watchAdsNum += 1;
        this.btnGetNum();
        if (lwg.Global._watchAdsNum >= 3) {
            lwg.Global._havePifu.push('09_aisha');
            lwg.Global._currentPifu = lwg.Enum.PifuAllName[8];
            lwg.Admin._openScene(lwg.Admin.SceneName.UIStart, null, null, f => {
                this.self.close();
                lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].self['BtnXD'].removeSelf();
            });
            lwg.Global._createHint_01(lwg.Enum.HintType.getXD);
        }
        lwg.LocalStorage.addData();
    }

    lwgDisable(): void {
        lwg.Global._stageClick = true;
        lwg.Global.GoldNumNode.alpha = 1;
        lwg.Global.ExecutionNumNode.alpha = 1;
    }
}