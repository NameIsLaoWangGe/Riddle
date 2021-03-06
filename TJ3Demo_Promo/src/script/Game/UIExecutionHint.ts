import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UIExecutionHint extends lwg.Admin.Scene {

    lwgInit() {
        ADManager.ShowBanner();
        lwg.Global._stageClick = false;

        if (!lwg.Global._elect) {
            this.self['P201'].visible = false;
        }
    }
    adaptive() {
        this.self['sceneContent'].y = Laya.stage.height * 0.481;
        this.self['P201'].y = Laya.stage.height * 0.093;
    }
    btnOnClick(): void {
        ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_noticket');
        ADManager.TAPoint(TaT.BtnShow, 'close_noticket');

        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['BtnGet'], this, null, null, this.btnGetUp, null);
        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['BtnClose'], this, this.btnCloseDown, null, this.btnCloseUp, this.btnCloseOut);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['Btn'], this, null, null, null, null);
    }
    btnGetUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_noticket');
        ADManager.ShowReward(() => {
            this.btnGetUp_advFunc();
        })
    }

    btnGetUp_advFunc(): void {
        lwg.Global._execution += 5;
        lwg.Global._createAddExecution(null, null, f => {
            let num = lwg.Global.ExecutionNumNode.getChildByName('Num') as Laya.FontClip;
            num.value = lwg.Global._execution.toString();
        });
        lwg.LocalStorage.addData();
        this.self.close();
    }

    /**每天一次免费按住关闭按钮三秒，可以免体力进入游戏一次*/
    time: number;
    timeSwitch: boolean = false;
    btnCloseDown(): void {
        this.timeSwitch = true;
    }

    btnCloseUp(event): void {
        this.timeSwitch = false;
        ADManager.TAPoint(TaT.BtnClick, 'close_noticket');
        this.self.close();
    }
    btnCloseOut(): void {
        this.timeSwitch = false;
    }

    onUpdate() {
        if (this.timeSwitch) {
            this.time++;
            if (this.time >= 180) {
                this.timeSwitch = false;
                if (!lwg.Global._exemptEx) {
                    lwg.Global._createHint_01(lwg.Enum.HintType.no_exemptExTime);
                    return;
                }
                this.time = 0;
                lwg.Global._exemptExTime = (new Date).getDate();
                lwg.Global._exemptEx = false;

                if (lwg.Admin._gameState === lwg.Admin.GameState.GameStart) {
                    if (lwg.Admin._sceneControl['UIStart'].parent) {
                        lwg.Admin._sceneControl['UIStart']['UIStart'].openPlayScene_exemptEx();
                    }
                } else if (lwg.Admin._gameState === lwg.Admin.GameState.Victory) {
                    if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                        lwg.Admin._closeCustomScene();
                        lwg.Global._gameLevel++;
                        lwg.Admin._openGLCustoms();
                    } else {
                        lwg.Admin._closeCustomScene();
                        lwg.Admin.openLevelNum++;
                        lwg.Admin._openLevelNumCustom();
                    }

                    // 表现上加上
                    let Num = lwg.Global.GoldNumNode.getChildByName('Num') as Laya.FontClip;
                    Num.value = (Number(Num.value) + 25).toString();

                } else if (lwg.Admin._gameState === lwg.Admin.GameState.Defeated) {
                    if (lwg.Global.intoBtn === 'BtnLast') {
                        if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                            lwg.Admin._closeCustomScene();
                            lwg.Global._gameLevel++;
                            lwg.Admin._openGLCustoms();
                        } else {
                            lwg.Admin._closeCustomScene();
                            lwg.Admin.openLevelNum++;
                            lwg.Admin._openLevelNumCustom();
                        }
                    } else {
                        lwg.Admin._refreshScene();
                    }
                }
                console.log('免费进入游戏一次');
                lwg.LocalStorage.addData();
                this.self.close();
            }
        } else {
            this.time = 0;
        }
    }

    lwgDisable(): void {
        lwg.Global._stageClick = true;
        ADManager.CloseBanner();
    }
}