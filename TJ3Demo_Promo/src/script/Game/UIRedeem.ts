import { lwg } from "../Lwg_Template/lwg";

export default class UIRedeem extends lwg.Admin.Scene {

    TextInput: Laya.TextInput;

    selfVars(): void {
        this.TextInput = this.self['TextInput'];
    }

    adaptive(): void {
        this.self['SceneContent'].y = Laya.stage.height * 0.478;
    }

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.self['BtnYes'], this, null, null, this.btnYesClickUP, null);
        lwg.Click.on('largen', null, this.self['BtnNo'], this, null, null, this.btnNoClickUP, null);
    }

    btnYesClickUP(event): void {
        let input = this.TextInput.getChildAt(0) as Laya.Input;
        if (input.text === '23332333') {

            lwg.Admin._openScene(lwg.Admin.SceneName.UIAnchorXD, null, this.self, null);
        } else {

            lwg.Global._createHint_01(lwg.Enum.HintType.inputerr);
        }
        event.currentTarget.scale(1, 1);
    }

    btnNoClickUP(event): void {
        event.currentTarget.scale(1, 1);
        this.self.close();
    }


}