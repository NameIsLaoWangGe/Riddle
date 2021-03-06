import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UIPassHint extends lwg.Admin.Scene {
    /**是从哪个界面进来的*/
    intoScene: string;
    /**是否是失败后再进游戏弹出来的*/
    afterDefeated: boolean;
    lwgInit() {
        console.log('出现提示界面');
        ADManager.ShowBanner();
        lwg.Global._stageClick = false;
    }
    adaptive() {
        this.self['sceneContent'].y = Laya.stage.height * 0.481;
    }

    /**时间到了后有没有看广告*/
    advAfter: boolean = false;
    openAni(): number {
        this.self['BtnNo'].visible = false;
        setTimeout(() => {
            if (this.intoScene === 'UIMain') {

            } else if (lwg.Admin._gameState === lwg.Admin.GameState.Play) {
                if (this.advAfter) {
                    this.self['BtnNo'].visible = false;
                } else {
                    this.self['BtnNo'].visible = true;
                }
            } else {
                this.self['BtnNo'].visible = true;
            }
        }, lwg.Global._btnDelayed);

        return 0;
    }

    /**用于免费提示彩蛋中弹出的界面样式*/
    setStyle(): void {
        // 如果从双击彩蛋中进来，则直接是确定
        this.self['Pic'].skin = 'UI_new/PassHint/word_yes.png';
        this.self['BtnNo'].visible = false;
        this.self['iconAdv'].visible = false;
        let num = lwg.Admin.openCustomName.substring(lwg.Admin.openCustomName.length - 3, lwg.Admin.openCustomName.length);
        this.self['Dec'].text = '  ' + lwg.Global._hintDec[Number(num) - 1]['dec'];
        this.self['Pic'].x = this.self['BtnYse'].width / 2 + 10;
        this.self['Pic'].y -= 3;
        this.intoScene = 'UIMain';
    }

    btnOnClick(): void {
        ADManager.TAPoint(TaT.BtnShow, 'ADrewordbt_freegift');
        ADManager.TAPoint(TaT.BtnShow, 'closeword_freegift');

        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnYse'], this, null, null, this.btnYseUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
    }

    // 看广告获得提示
    btnYseUp(event): void {

        ADManager.TAPoint(TaT.BtnClick, 'ADrewordbt_freegift');

        event.currentTarget.scale(1, 1);
        // 第二次点击会弹出失败界面
        if (this.self['Pic'].skin === 'UI_new/PassHint/word_yes.png') {
            // this.self['BtnNo']这个按钮不存在，是因为走了免费提示的彩蛋，直接关闭自己
            this.closeScene();
        } else if (this.self['Pic'].skin === 'UI_new/Defeated/word_freereplay.png') {
            lwg.Admin._refreshScene();
            this.self.close();
        } else {
            ADManager.ShowReward(() => {
                this.btnYseUpFunc();
            })
        }
    }
    btnYseUpFunc(): void {
        this.advAfter = true;
        if (this.intoScene === lwg.Admin.SceneName.UIDefeated) {
            this.self['Pic'].skin = 'UI_new/Defeated/word_freereplay.png';
            this.self['Pic'].x -= 30;
        } else {
            this.self['Pic'].skin = 'UI_new/PassHint/word_yes.png';
            this.self['Pic'].x = this.self['BtnYse'].width / 2 + 10;
            this.self['Pic'].y -= 3;
        }
        this.self['BtnNo'].visible = false;
        this.self['iconAdv'].visible = false;
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

        } else if (lwg.Admin._gameState === lwg.Admin.GameState.Victory) {
            lwg.Admin._nextCustomScene(2);
            lwg.Global._goldNum += 25;
            lwg.LocalStorage.addData();

        } else if (lwg.Admin._gameState === lwg.Admin.GameState.Defeated) {
            if (this.afterDefeated) {
                lwg.Admin._nextCustomScene(2);
            } else {
                lwg.Admin._openScene(lwg.Admin.SceneName.UIDefeated, null, null, null);
            }
        } else if (lwg.Admin._gameState === lwg.Admin.GameState.Play) {
            if (this.intoScene === 'UIMain') {
                this.self.close();
            } else {
                lwg.Admin._openScene(lwg.Admin.SceneName.UIDefeated, null, null, null);
            }
        }
        this.self.close();
    }
    lwgDisable() {
        ADManager.CloseBanner();
        lwg.Global._stageClick = true;
        console.log('关闭提示界面');
    }
}