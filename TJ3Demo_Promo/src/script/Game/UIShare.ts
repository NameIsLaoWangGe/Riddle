import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";
import RecordManager from "../../TJ/RecordManager";

export default class UIShare extends lwg.Admin.Scene {
    /**会主界面按钮*/
    BtnUIStart: Laya.Sprite;
    /**继续游戏按钮*/
    BtnContinue: Laya.Sprite;

    adaptive(): void {
        this.self['SceneContent'].y = Laya.stage.height / 2;
    }
    btnOnClick(): void {
        ADManager.TAPoint(TaT.BtnShow, 'home_pause');
        ADManager.TAPoint(TaT.BtnShow, 'continue_pause');

        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['background'], this, null, null, this.backgroundUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnNoShare'], this, null, null, this.btnNoShareUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
    }
    backgroundUp(event): void {
        console.log('点击背景也是分享！');
        RecordManager._share('award', () => {
            this.btnShareUpFunc();
        })
    }
    btnNoShareUp(event): void {
        this.self.close();
        event.currentTarget.scale(1, 1);
    }
    btnShareUp(event): void {
        console.log('点击按钮的分享！');
        event.currentTarget.scale(1, 1);
        RecordManager._share('award', () => {
            this.btnShareUpFunc();
        })
    }
    btnShareUpFunc(): void {
        // 分享可以获得奖励
        console.log('分享成功了！');
        // this.getGoldAni(15, f => {
        //     this.self.close();
        //     let d = new Date();
        //     lwg.Global._hotShare = false;
        //     lwg.Global._hotShareTime = d.getDate();
        // })
        lwg.Global._createHint_01(lwg.Enum.HintType.shareyes);
        lwg.Global._goldNum += 125;
        let Num = lwg.Global.GoldNumNode.getChildByName('Num') as Laya.FontClip;
        Num.value = (Number(Num.value) + 125).toString();
        this.self.close();
        let d = new Date();
        lwg.Global._hotShare = false;
        lwg.Global._hotShareTime = d.getDate();
    }

}