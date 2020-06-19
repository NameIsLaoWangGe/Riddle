import { lwg } from "../Lwg_Template/lwg";
import ADManager from "../../TJ/Admanager";

export default class UISmallHint extends lwg.Admin.Scene {


    adaptive(): void {
        this.self['SceneContent'].y = Laya.stage.height / 2;
    }

    btnOnClick(): void {
        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['BtnYes'], this, null, null, this.btnYesUp, null);
        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
    }

    btnYesUp(): void {
        ADManager.ShowReward(() => {
            lwg.Admin._openScene(lwg.Admin.SceneName.UIPassHint, null, null, f => {
                lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = 'UIMain';
                lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].setStyle();
                this.self.close();
            });
        })
    }

    btnNoUp(): void {
        this.self.close();
    }
}