import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UIPassHint extends lwg.Admin.Scene {

    adaptive() {
        this.self['sceneContent'].y = Laya.stage.height * 0.481;
    }
    /**用于免费提示彩蛋中控制界面弹出的样式*/
    setStyle(): void {
        // 如果从双击彩蛋中进来，则直接是确定
        this.self['Pic'].skin = 'UI_new/PassHint/word_yes.png';
        this.self['BtnNo'].visible = false;
        this.self['iconAdv'].visible = false;
        let num = lwg.Admin.openCustomName.substring(lwg.Admin.openCustomName.length - 3, lwg.Admin.openCustomName.length);
        this.self['Dec'].text = '  ' + lwg.Global._hintDec[Number(num) - 1]['dec'];
    }

    btnOnClick(): void {
        ADManager.TAPoint(TaT.BtnShow, 'ADrewordbt_freegift');
        ADManager.TAPoint(TaT.BtnShow, 'closeword_freegift');

        lwg.Click.on(lwg.Enum.ClickType.largen, null, this.self['BtnYse'], this, null, null, this.btnYseUp, null);
        lwg.Click.on(lwg.Enum.ClickType.largen, null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
    }

    // 看广告获得提示
    btnYseUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADrewordbt_freegift');

        event.currentTarget.scale(1, 1);
        // 第二次点击会弹出失败界面
        if (this.self['Pic'].skin === 'UI_new/PassHint/word_yes.png') {
            // this.self['BtnNo']这个按钮不存在，是因为走了免费提示的彩蛋，直接关闭自己
            if (!this.self['BtnNo'].visible) {
                this.self.close();
            } else {
                this.closeScene();
            }
        } else {
            ADManager.ShowReward(() => {
                this.btnYseUpFunc();
            })
        }
    }
    btnYseUpFunc(): void {
        this.self['Pic'].skin = 'UI_new/PassHint/word_yes.png';
        this.self['iconAdv'].visble = false;
        let num = lwg.Admin.openCustomName.substring(lwg.Admin.openCustomName.length - 3, lwg.Admin.openCustomName.length);
        this.self['Dec'].text = '  ' + lwg.Global._hintDec[Number(num) - 1]['dec'];
    }

    btnNoUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'closeword_freegift');
        event.currentTarget.scale(1, 1);
        this.closeScene();
    }

    /**关闭场景打开其他场景*/
    closeScene(): void {
        if (lwg.Admin._gameState === lwg.Admin.GameState.GameStart) {
            lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].openPlayScene();
        } else {
            if (lwg.Admin._gameState === lwg.Admin.GameState.Victory) {
                lwg.Global._execution -= 2;
                lwg.Global._createHint(lwg.Enum.HintType.consumeEx);
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
                lwg.Global._goldNum += 25;
                // console.log(lwg.Admin.openLevelNum, lwg.Global._gameLevel);
                lwg.LocalStorage.addData();
            } else {
                lwg.Admin._openScene('UIDefeated', null, null, null);
            }
        }
        this.self.close();
    }
}