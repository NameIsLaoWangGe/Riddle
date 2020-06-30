import { lwg } from "../Lwg_Template/lwg";
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
    lwgInit() {
        ADManager.TAPoint(TaT.LevelStart, 'level' + lwg.Admin.openLevelNum);
        RecordManager.startAutoRecord();
        // 关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;
        this.BtnAgain = this.self['BtnAgain'];
        this.Wangzi = this.self['Wangzi'];
        this.KeyNum = this.self['KeyNum'];
        this.Gongzhu = this.self['Gongzhu'];

        lwg.Global._gameStart = true;

        lwg.Global._createBtnAgain(this.self);
        lwg.Global._createBtnPause(this.self);
        lwg.Global._createBtnHint(this.self);

        if (lwg.Global._elect) {
            lwg.Global._createP201_01(this.self);
        }

        if (this.self.name === 'UIMain_001' && lwg.Global._gameLevel !== 1) {
            this.self['Finger'].visible = false;
            this.self['guideRoom'].visible = false;
        }
    }

    openAni(): void {
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
        // 将背景图放大防止穿帮
        this.self['background'].width = 5000;
        this.self['background'].height = 5000;
        this.self['background'].x -= 2500;
        this.self['background'].y -= 2500;
        // 利用动画来进行放大移动操作
        lwg.Animation.move_Scale(self, 1, self.x, self.y, Laya.stage.width / 2, Laya.stage.height / 2, 2, 500, 100, f => {
            // lwg.Effects.createFireworks()
            Laya.timer.frameOnce(90, this, f => {
                lwg.Admin._openScene('UIVictory', null, null, null);
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
            console.log('本关胜利打点');
        } else {
            ADManager.TAPoint(TaT.LevelFail, 'level' + lwg.Admin.openLevelNum);
            console.log('本关失败打点');
        }
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
    }
}