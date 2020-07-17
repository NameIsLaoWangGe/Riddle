import { lwg, Animation, EventAdmin } from "../Lwg_Template/lwg";
import RecordManager from "../../TJ/RecordManager";
import ADManager, { TaT } from "../../TJ/Admanager";
import UIMain_Wangzi from "./UIMain_Wangzi";
import UIMain_Gongzhu from "./UIMain_Gongzhu";

export default class UIMain extends lwg.Admin.Scene {
    constructor() {
        super();
    }
    /**主角*/
    Gongzhu: Laya.Sprite;
    /**王子*/
    Wangzi: Laya.Sprite;
    /**王子的父节点*/
    WAngziPrent: Laya.Image;
    /**重来按钮*/
    BtnAgain: Laya.Sprite;
    /**钥匙数量*/
    KeyNum: Laya.Sprite;
    /**最后一次被拾取的房间，用于被吸附到另一个房间*/
    _roomPickup: Laya.Image;
    /**本关是胜利还是失败*/
    victory: boolean = false;

    selfVars(): void {
        this.BtnAgain = this.self['BtnAgain'];
        this.Wangzi = this.self['Wangzi'];
        this.KeyNum = this.self['KeyNum'];
        this.Gongzhu = this.self['Gongzhu'];
    }
    lwgInit() {
        ADManager.TAPoint(TaT.LevelStart, 'level' + lwg.Admin.openLevelNum);
        RecordManager.startAutoRecord();

        // 关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;

        lwg.Global._gameStart = true;

        lwg.Global._createBtnAgain(this.self);
        lwg.Global._createBtnPause(this.self);
        lwg.Global._createBtnHint(this.self);

        lwg.Global._createStimulateDec(this.self);

        // if (lwg.Global._elect) {
        //     lwg.Global._createP201_01(this.self);
        // }

        if (this.self.name === 'UIMain_001' && lwg.Global._gameLevel !== 1) {
            this.self['Finger'].visible = false;
            this.self['guideRoom'].visible = false;
        }

        EventAdmin.register(EventAdmin.EventType.victory, this, f => {
            this.victoryAni();
        })

        this.gameOverAniDir = Math.floor(Math.random() * 2) === 1 ? 'left' : 'right';
    }

    openAni(): number {
        // lwg.Global._gameStart = false;


        // let num1 = 0;
        // let num2 = 0;
        // let num3 = 0;
        // let num4 = 0;
        // this.aniTime = 500;
        // this.aniDelayde = 100;
        // for (let index = 0; index < this.self.numChildren; index++) {
        //     const element = this.self.getChildAt(index) as Laya.Image;
        //     if (element.name.substring(0, 4) === 'Room') {
        //         if (element.x > Laya.stage.width / 2 && element.y > Laya.stage.height / 2) {
        //             num1++;
        //             Animation.move_Simple(element, 1500, element.y, element.x, element.y, this.aniTime * num1, this.aniDelayde * 0, f => { });

        //         } else if (element.x > Laya.stage.width / 2 && element.y <= Laya.stage.height / 2) {
        //             num2++;
        //             Animation.move_Simple(element, 1500, element.y, element.x, element.y, this.aniTime * num2, this.aniDelayde * 0, f => { });

        //         } else if (element.x <= Laya.stage.width / 2 && element.y > Laya.stage.height / 2) {
        //             num3++;
        //             Animation.move_Simple(element, -800, element.y, element.x, element.y, this.aniTime * num3, this.aniDelayde * 0, f => { });

        //         } else if (element.x <= Laya.stage.width / 2 && element.y <= Laya.stage.height / 2) {
        //             num4++;
        //             Animation.move_Simple(element, -800, element.y, element.x, element.y, this.aniTime * num4, this.aniDelayde * 0, f => { });
        //         }
        //     }
        // }

        // let arr = [num1, num2, num3, num3];
        // arr.sort();
        // return this.aniTime * arr[arr.length - 1];
        return 0;
    }

    btnOnClick(): void {
        this.self.on(Laya.Event.DOUBLE_CLICK, this, this.stageDB);
    }

    stageDB(): void {
        if (lwg.Global._freetHint && lwg.Global._gameLevel !== 1 && lwg.Global._gameLevel !== 29 && lwg.Admin.openLevelNum !== 1 && lwg.Admin.openLevelNum !== 29) {
            console.log('免费提示出现！');
            lwg.Global._freeHintTime = (new Date).getDate();
            lwg.Global._freetHint = false;
            lwg.LocalStorage.addData();
            lwg.Admin._openScene('UIPassHint', null, null, f => {
                lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].setStyle();
            });
        } else if (!lwg.Global._freetHint) {
            console.log('今日免费提示机会用完了！');
        } else {
            console.log('第1关和第29关不会出现免费提示！');
        }
    }

    /**主角的跳跃方向*/
    gameOverAniDir: string;
    victoryAni(): void {
        lwg.Global._gameStart = false;
        // 修改物理组件的父容器为当前场景，否则放大当前场景不会改变子节点物理组件
        let self = this.self as Laya.View;
        let i = Laya.Physics.I;
        i.worldRoot = self;
        // 王子和公主的中间位置为放大的目标位置
        let targetX = (this.Wangzi.x + this.Gongzhu.x) / 2;
        let targetY = (this.Wangzi.y + this.Gongzhu.y) / 2;
        // 将锚点设置为目标位置，并且补上修改锚点带来的位置偏移
        self.x += targetX;
        self.y += targetY;
        self.anchorX = targetX / self.width;
        self.anchorY = targetY / self.height;
        // 利用动画来进行放大移动操作
        lwg.Animation.move_Scale(self, 1, self.x, self.y, Laya.stage.width / 2, Laya.stage.height / 2, 2, 500, 100, f => {
            // lwg.Effects.createFireworks()
            Laya.timer.frameOnce(40, this, f => {
                lwg.Global._gameOverAni = true;
                Laya.timer.frameOnce(100, this, f => {
                    lwg.Admin._openScene(lwg.Admin.SceneName.UIVictoryBox, null, null, null);
                })
            });
        });
    }

    /**计时器*/
    timer: number = 0;
    onUpdate(): void {
        if (!lwg.Global._gameStart) {
            return;
        }
        this.timer++;
        if (this.self.name === 'UIMain_001') {
            if (lwg.Global._gameLevel === 1) {
                if (this.timer % 85 === 0 || this.timer === 1) {
                    lwg.Animation.move_Simple(this.self['Finger'], this.self['Room1'].x, this.self['Room1'].y, this.self['guideRoom'].x, this.self['guideRoom'].y, 800, 0, f => {
                    });
                    if (this.self['Wangzi']['UIMain_Wangzi'].belongRoom === this.self['Gongzhu']['UIMain_Gongzhu'].belongRoom) {
                        this.self['Finger'].alpha = 0;
                        this.self['Finger'].alpha = 0;
                    } else {
                        this.self['Finger'].alpha = 1;
                        this.self['Finger'].alpha = 1;
                    }
                }
            }
        }
    }

    lwgDisable(): void {
        if (this.victory) {
            ADManager.TAPoint(TaT.LevelFinish, 'level' + lwg.Admin.openLevelNum);
        } else {
            ADManager.TAPoint(TaT.LevelFail, 'level' + lwg.Admin.openLevelNum);
        }
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
        lwg.Global._gameOverAni = false;
    }
}