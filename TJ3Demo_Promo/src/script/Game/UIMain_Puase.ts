import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_Puase extends lwg.Admin.Scene {
    /**会主界面按钮*/
    BtnUIStart: Laya.Sprite;
    /**继续游戏按钮*/
    BtnContinue: Laya.Sprite;
    lwgInit(): void {
        this.BtnUIStart = this.self['BtnUIStart'];
        this.BtnContinue = this.self['BtnContinue'];
    }
    btnOnClick(): void {
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnUIStart, this, null, null, this.BtnUIStartUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnContinue, this, null, null, this.BtnContinueUp, null);
    }
    BtnUIStartUp(): void {
        lwg.Admin._openScene('UIStart', null, this.self, null);
        lwg.Admin._closeCustomScene();
    }
    BtnContinueUp(): void {
        this.self.close();
    }
}