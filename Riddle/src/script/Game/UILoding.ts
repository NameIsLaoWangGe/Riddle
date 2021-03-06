import UIMain from './UIMain';
import { lwg } from '../Lwg_Template/lwg';
export default class UILoding extends lwg.Admin.Scene {
    /**游戏加载进度条*/
    private Progress: Laya.Sprite;
    /**logo*/
    private Logo: Laya.Sprite;
    /**进度条*/
    private ProgressBar: Laya.Sprite;
    /**进度条遮罩*/
    private Mask: Laya.Image;

    lwgInit(): void {
        this.Mask = this.self['Mask'];
        lwg.Global._gameLevel = 1;
        if (lwg.Global._voiceSwitch) {
            lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
        }
        lwg.Sk.skLoding();
        this.lodeUserInfo();
        this.dataLoading();
    }

    /**优先加载数据表*/
    dataLoading(): void {
        Laya.loader.load("Data/HintDec.json", Laya.Handler.create(this, this.levelsOnLoaded), null, Laya.Loader.JSON);
    }

    /**回调函数*/
    levelsOnLoaded(): void {
        lwg.Global._hintDec = Laya.loader.getRes("Data/HintDec.json")["RECORDS"];
        // 关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;
        // console.log(lwg.Global._hintDec);
        // this.lodeMianScene3D();
    }

    /**加载游戏内的3D场景，两个场景同时出现*/
    lodeMianScene3D(): void {
        Laya.Scene3D.load("testScene/LayaScene_GameMain/Conventional/GameMain.ls", Laya.Handler.create(this, this.mianSceneComplete));
    }

    /**记录游戏主场景是否完成，用于进度条的进度控制*/
    private mianSceneOk: boolean = false;
    /**回调函数*/
    mianSceneComplete(scene: Laya.Scene3D): void {
        // 将场景加到舞台上，注意层级
        Laya.stage.addChildAt(scene, 0);
        scene.addComponent(UIMain);
        // 进度条加满
        this.Mask.x = 0;
        // 打开开始游戏界面并关闭自己
        lwg.Admin._openScene('UIStart', 1, this.self, null);
        this.lodeUserInfo();
        this.mianSceneOk = true;
    }

    /**加载玩家信息*/
    lodeUserInfo(): void {
        let data: any = lwg.LocalStorage.getData();
        if (data) {
            lwg.Global._gameLevel = data._gameLevel;
            lwg.Global._goldNum = data._goldNum;
            lwg.Global._execution = data._execution;
            // lwg.Global._buyNum = data._buyNum;
            // lwg.Global._currentPifu = data._currentPifu;
            // lwg.Global._havePifu = data._havePifu;
            // lwg.Global._watchAdsNum = data._watchAdsNum;
            // lwg.Global._gameOverAdvModel = data._gameOverAdvModel;
            // lwg.Global._whetherAdv = data._whetherAdv;
        }
    }

    /**计时器*/
    private time = 0;
    onUpdate(): void {
        this.time++;
        // 模拟加载进度
        if (this.time === 60) {
            this.Mask.x = -72;
            lwg.Admin._openScene('UIStart', 0, this.self, null);
        } else if (this.time === 80) {

        }
    }

    onDisable(): void {

    }
}