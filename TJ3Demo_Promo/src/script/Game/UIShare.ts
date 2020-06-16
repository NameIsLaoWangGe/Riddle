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

        lwg.Click.on(lwg.Enum.ClickType.noEffect, null, this.self['background'], this, null, null, this.backgroundUp, null);
        lwg.Click.on(lwg.Enum.ClickType.largen, null, this.self['BtnNoShare'], this, null, null, this.btnNoShareUp, null);
        lwg.Click.on(lwg.Enum.ClickType.largen, null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
    }
    backgroundUp(event): void {
        console.log('点击背景也是分享！');
        RecordManager._share(() => {
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
        RecordManager._share(() => {
            this.btnShareUpFunc();
        })
    }
    btnShareUpFunc(): void {
        // 分享可以获得奖励
        console.log('分享成功了！')
        lwg.Global._goldNum += 100;
        this.self.close();
        // let d = 
    }
}