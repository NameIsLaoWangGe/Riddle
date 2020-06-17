import UIMain from "../Game/UIMain";
import ADManager, { TaT } from "../../TJ/Admanager";

/**综合模板*/
export module lwg {
    /**全局控制,全局变量*/
    export module Global {
        /**当前的关卡是第几关*/
        export let _gameLevel: number = 1;
        /**游戏是否处于开始状态*/
        export let _gameStart = false;
        /**当前剩余行动力的数量*/
        export let _execution = 100;
        /**当前免体力进游戏的日期，只要当前日期和下次日期不同，说明不是同一天，则给予一次免体力进入彩蛋机会*/
        export let _exemptExTime: number;
        /**当前是否可以免体力进入一次*/
        export let _exemptEx: boolean = true;

        /**用于今天是否进行了热门分享的日期*/
        export let _hotShareTime: number;
        /**当前是否可以免体力进入一次*/
        export let _hotShare: boolean = true;

        /**当前免费双击关卡提示，只要当前日期和下次日期不同，说明不是同一天，则给予一次免体力进入彩蛋机会*/
        export let _freeHintTime: number;
        /**当前是否可以免体力进入一次*/
        export let _freetHint: boolean = true;

        /**记录上传体力的时间，用于对比下次进入游戏时时间差，补偿多少体力*/
        export let _addExHours: number;
        export let _addMinutes: number;




        /**最后一次被拾取的房间，用于被吸附到另一个房间*/
        export let _roomPickup: Laya.Image;
        /**关卡总数*/
        export let _CustomsNum: number = 999;
        /**关闭舞台点击事件*/
        export let _stageClick: boolean = true;

        /**在体力提示界面中，用于判断在失败界面时，判断从哪个按钮进去，是通过重来按钮还是下一关按钮进来的*/
        export let intoBtn: string;


        /**当前金币总数数量*/
        export let _goldNum = 0;
        /**关卡数据表*/
        export let _levelsData: any;

        /**过关提示的描述*/
        export let _hintDec: any
        /**声音开关*/
        export let _voiceSwitch: boolean = true;
        /**手机震动开关*/
        export let _shakeSwitch: boolean = true;

        /**当前选中的皮肤样式*/
        export let _currentPifu: string;
        /**当前拥有的皮肤名称集合*/
        export let _havePifu: Array<string>;
        /**当前未拥有皮肤名称集合*/
        export let _notHavePifu: Array<string>;
        /**当前未拥有皮肤名称，删除超人的皮肤*/
        export let _notHavePifuSubChaoren: Array<string>;
        /**所有的皮肤的和排列顺序*/
        export let _allPifu: Array<string> = ['01_gongzhu', '02_chiji', '03_change', '04_huiguniang', '05_tianshi', '06_xiaohongmao', '07_xiaohuangya', '08_zhenzi', '09_aisha'];

        /**购买次数,随着购买次数的增加，消耗金币也会增加,超人皮肤是看广告获得，暂时不可买到*/
        export let _buyNum: number;

        /**限定皮肤剩余点击看广告的次数*/
        export let _watchAdsNum: number;

        /**是否接入了广告*/
        export let _whetherAdv: boolean;

        /**当前在游戏结束后，看广告的模式*/
        export let _gameOverAdvModel: number;

        /**当前是否为评测版本,隐藏某些功能*/
        export let pingceV: boolean = true;

        /**屏幕震动*/
        export function _vibratingScreen(): void {

        }

        /**指代当前界面的等级节点*/
        export let LevelNode: Laya.Sprite;
        /**
         * 创建通用剩余钥匙数量prefab
         * @param parent 父节点
         * @param x x位置
         * @param y y位置
         */
        export function _createLevel(parent, x, y): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/LevelNode.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                parent.addChild(sp);
                sp.pos(x, y);
                sp.zOrder = 0;
                let level = sp.getChildByName('level') as Laya.Label;
                level.text = 'NO.' + lwg.Global._gameLevel;
                LevelNode = sp;
            }));
        }

        /**指代当前界面的钥匙数量节点*/
        export let KeyNumNode: Laya.Sprite;
        /**
         * 创建通用剩余钥匙数量prefab
         * @param parent 父节点
         * @param x x位置
         * @param y y位置
         */
        export function _createKeyNum(parent, x, y): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/KeyNum.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                parent.addChild(sp);
                sp.pos(x, y);
                sp.zOrder = 0;
                let num = sp.getChildByName('Num') as Laya.Label;
                num.text = lwg.Global._execution + '/' + '5';
                KeyNumNode = sp;
            }));
        }

        /**指代当前界面的重来按钮*/
        export let BtnSetNode: Laya.Sprite;
        /**
         * 创建通用剩余钥匙数量prefab
         * @param parent 父节点
         * @param x x位置
         * @param y y位置
         * @param soundUrl 音效的地址
         * @param caller 指向脚本（this）引用
         * @param down 按下函数
         * @param move 移动函数
         * @param up 抬起函数
         * @param out 出屏幕函数
         */
        export function _createBtnSet(parent): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/BtnSet.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                parent.addChild(sp);
                sp.pos(671, 273);
                sp.zOrder = 0;
                Click.on(Click.ClickType.largen, null, sp, null, null, null, btnSetUp, null);
                BtnSetNode = sp;
                BtnSetNode.name = 'BtnSetNode';
            }));
        }

        /**设置按钮抬起*/
        export function btnSetUp(): void {
            Admin._openScene('UISet', null, null, null);
        }

        /**指代当前界面的金币资源*/
        export let GoldNumNode: Laya.Sprite;
        /**
         * 创建通用剩余金币资源数量prefab
         * @param parent 父节点
         */
        export function _createGoldNum(parent): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/GoldNum.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                let num = sp.getChildByName('Num') as Laya.FontClip;
                num.value = Global._goldNum.toString();
                parent.addChild(sp);
                sp.pos(114, 91);
                sp.zOrder = 50;
                GoldNumNode = sp;
            }));
        }

        /**指代当前剩余体力节点*/
        export let ExecutionNumNode: Laya.Sprite;
        /**
         * 创建通用剩余体力数量prefab
         * @param parent 父节点
         */
        export function _createExecutionNum(parent): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/ExecutionNum.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                parent.addChild(sp);
                let num = sp.getChildByName('Num') as Laya.FontClip;
                num.value = Global._execution.toString();
                sp.pos(297, 90);
                sp.zOrder = 50;
                ExecutionNumNode = sp;
                ExecutionNumNode.name = 'ExecutionNumNode';
            }));
        }

        /**指代当前暂停游戏节点*/
        export let BtnPauseNode: Laya.Sprite;
        /**
         * 创建通用剩余体力数量prefab
         * @param parent 父节点
         */
        export function _createBtnPause(parent): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/BtnPause.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                parent.addChild(sp);
                sp.pos(645, 137);
                sp.zOrder = 0;
                BtnPauseNode = sp;
                BtnPauseNode.name = 'BtnPauseNode';
                Click.on(Click.ClickType.largen, null, sp, null, null, null, btnPauseUp, null);
            }));
        }
        export function btnPauseUp(event) {
            event.stopPropagation();
            event.currentTarget.scale(1, 1);
            lwg.Admin._openScene('UIPause', null, null, null);
        }

        /**指代游戏界面提示按钮节点*/
        export let BtnHintNode: Laya.Sprite;
        /**
         * 创建通用剩余体力数量prefab
         * @param parent 父节点
         */
        export function _createBtnHint(parent): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/BtnHint.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                parent.addChild(sp);
                sp.pos(645, 273);
                sp.zOrder = 0;
                BtnHintNode = sp;
                BtnHintNode.name = 'BtnHintNode';
                Click.on(Click.ClickType.largen, null, sp, null, null, null, btnHintUp, null);
            }));
        }
        export function btnHintUp(event) {
            event.currentTarget.scale(1, 1);
            event.stopPropagation();

            ADManager.ShowReward(() => {
                Admin._openScene(Admin.SceneName.UIPassHint, null, null, f => {
                    lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = 'UIMain';
                    lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].setStyle();
                });
            })
        }

        /**指代当前界面的重来按钮*/
        export let BtnAgainNode: Laya.Sprite;
        /**当前场景被刷新了几次*/
        export let refreshNum: number;
        /**
         * 创建通用重来prefab
         * @param parent 父节点
         * @param x x位置
         * @param y y位置
         * @param soundUrl 音效的地址
         * @param caller 指向脚本（this）引用
         * @param down 按下函数
         * @param move 移动函数
         * @param up 抬起函数
         * @param out 出屏幕函数
         */
        export function _createBtnAgain(parent): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/BtnAgain.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                parent.addChild(sp);
                sp.pos(645, 404);
                sp.zOrder = 0;
                Click.on(Click.ClickType.largen, null, sp, null, btnAgainUp, null, null, null);
                BtnAgainNode = sp;
            }));
        }
        export function btnAgainUp(event): void {
            event.stopPropagation();
            refreshNum++;
            event.currentTarget.scale(1, 1);
            Admin._refreshScene();
        }

        /**动态创建一个互推*/
        export let P201_01Node: Laya.Sprite;
        /**
         * 创建通用重来prefab
         * @param parent 父节点
         * @param x x位置
         * @param y y位置
         * @param soundUrl 音效的地址
         * @param caller 指向脚本（this）引用
         * @param down 按下函数
         * @param move 移动函数
         * @param up 抬起函数
         * @param out 出屏幕函数
         */
        export function _createP201_01(parent): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/P201.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('P201', _prefab.create, _prefab);
                parent.addChild(sp);
                sp.pos(90, 225);
                sp.zOrder = 65;
                P201_01Node = sp;
            }));
        }

        /**
         * 创建提示框prefab
         * @param type 类型，也就是提示文字类型
         */
        export function _createHint_01(type): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/HintPre_01.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                Laya.stage.addChild(sp);
                sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
                let dec = sp.getChildByName('dec') as Laya.Label;
                dec.text = Enum.HintDec[type];
                sp.zOrder = 100;

                dec.alpha = 0;
                Animation.scale_Alpha(sp, 0, 1, 0, 1, 1, 1, 200, 0, f => {
                    Animation.fadeOut(dec, 0, 1, 150, 0, f => {
                        Animation.fadeOut(dec, 1, 0, 200, 800, f => {
                            Animation.scale_Alpha(sp, 1, 1, 1, 1, 0, 0, 200, 0, f => {
                                sp.removeSelf();
                            });
                        });
                    });
                });
            }));
        }

        /**
        * 创建提示框prefab
        * @param type 类型，也就是提示文字类型
        */
        export function _createHint_02(type): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/HintPre_02.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                Laya.stage.addChild(sp);
                sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
                let dec = sp.getChildByName('dec') as Laya.Label;
                dec.text = Enum.HintDec[type];
                sp.zOrder = 100;

                Animation.HintAni_01(sp, 100, 100, 1000, 50, 100, f => {
                    sp.removeSelf();
                });
            }));
        }

        /**
         * 创建体力消耗动画
         * @param  subEx 消耗多少体力值
        */
        export function createConsumeEx(subEx): void {
            let label = Laya.Pool.getItemByClass('label', Laya.Label) as Laya.Label;
            label.name = 'label';//标识符和名称一样
            Laya.stage.addChild(label);
            label.text = '-2';
            label.fontSize = 40;
            label.bold = true;
            label.color = '#59245c';
            label.x = ExecutionNumNode.x + 100;
            label.y = ExecutionNumNode.y - label.height / 2 + 4;
            label.zOrder = 100;
            lwg.Animation.fadeOut(label, 0, 1, 200, 150, f => {
                lwg.Animation.leftRight_Shake(ExecutionNumNode, 15, 60, 0, null);
                lwg.Animation.fadeOut(label, 1, 0, 600, 400, f => {
                });
            });
        }


        /**
         * 创建金币prefab
         * @param type 类型，用在什么情况下
         * @param parent 父节点
         * @param x x位置
         * @param y y位置
        */
        export function _createGold(type, parent, x, y): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/GolPre.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                parent.addChild(sp);
                sp.pos(x, y);
            }));
        }

        /**
         * 创建体力增加的prefab
         * @param x x位置
         * @param y y位置
         * @param func 回调函数
        */
        export function _createAddExecution(x, y, func): void {
            let sp: Laya.Sprite;
            Laya.loader.load('prefab/execution.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                Laya.stage.addChild(sp);
                sp.x = Laya.stage.width / 2;
                sp.y = Laya.stage.height / 2;
                sp.zOrder = 50;
                if (ExecutionNumNode) {
                    Animation.move_Simple_01(sp, sp.x, sp.y, ExecutionNumNode.x, ExecutionNumNode.y, 800, 100, f => {
                        Animation.fadeOut(sp, 1, 0, 200, 0, f => {
                            lwg.Animation.upDwon_Shake(ExecutionNumNode, 10, 80, 0, null);
                            if (func) {
                                func();
                            }
                        });
                    });
                }
            }));
        }
    }

    /**本地信息存储*/
    export module LocalStorage {
        let storageData: any;
        /**上传本地数据到缓存,一般在游戏胜利后和购买皮肤后上传*/
        export function addData(): void {
            storageData = {
                '_gameLevel': lwg.Global._gameLevel,
                '_goldNum': lwg.Global._goldNum,
                '_execution': lwg.Global._execution,
                '_exemptExTime': lwg.Global._exemptExTime,
                '_freeHintTime': lwg.Global._freeHintTime,
                '_hotShareTime': lwg.Global._hotShareTime,
                '_addExHours': lwg.Global._addExHours,
                '_addMinutes': lwg.Global._addMinutes,

                // '_buyNum': lwg.Global._buyNum,
                // '_currentPifu': lwg.Global._currentPifu,
                // '_havePifu': lwg.Global._havePifu,
                // '_watchAdsNum': lwg.Global._watchAdsNum,
                // '_gameOverAdvModel': lwg.Global._gameOverAdvModel,
            }
            // 转换成字符串上传
            let data: string = JSON.stringify(storageData);
            Laya.LocalStorage.setJSON('storageData', data);
        }

        /**清除本地数据*/
        export function clearData(): void {
            Laya.LocalStorage.clear();
        }

        /**获取本地数据，在onlode场景获取*/
        export function getData(): any {
            let storageData: string = Laya.LocalStorage.getJSON('storageData');
            if (storageData) {
                // 将字符串转换成json
                let data: any = JSON.parse(storageData);
                return data;
            } else {
                lwg.Global._gameLevel = 1;
                lwg.Global._goldNum = 0;
                lwg.Global._execution = 15;
                lwg.Global._exemptExTime = null;
                lwg.Global._freeHintTime = null;
                lwg.Global._hotShareTime = null;
                lwg.Global._addExHours = (new Date).getHours();
                lwg.Global._addMinutes = (new Date).getMinutes();
                // lwg.Global._buyNum = 1;
                // lwg.Global._currentPifu = Enum.PifuAllName[0];
                // lwg.Global._havePifu = ['01_xiaofu'];
                // lwg.Global._watchAdsNum = 0;
                // lwg.Global._gameOverAdvModel = 1;
                // lwg.Global._whetherAdv = false;
                return null;
            }
        }
    }

    /*场景和UI模块的一些通用属性*/
    export module Admin {
        /**场景控制,访问特定场景用_sceneControl[name]方位*/
        export let _sceneControl: any = {};
        /**游戏当前处于什么状态中*/
        export let _gameState: string;

        /**当前所有场景的名称*/
        export enum SceneName {
            UILoding = 'UILoding',
            UIStart = 'UIStart',
            UIMain = 'UIMain',
            UIVictory = 'UIVictory',
            UIDefeated = 'UIDefeated',
            UIExecutionHint = 'UIExecutionHint',
            UIPassHint = 'UIPassHint',
            UISet = 'UISet',
            UIPifu = 'UIPifu',
            UIPuase = 'UIPuase',
            UIShare = 'UIShare',
        }
        /**游戏当前的状态*/
        export enum GameState {
            /**开始界面*/
            GameStart = 'GameStart',
            /**游戏中*/
            Play = 'Play',
            /**暂停中*/
            Pause = 'pause',
            /**胜利*/
            Victory = 'victory',
            /**失败*/
            Defeated = 'defeated',
        }
        /**
          * 打开界面
          * @param name 界面名称
          * @param zOder 指定层级
          * @param cloesScene 需要关闭的场景，如果不需要关闭，传入null
          * @param func 回调函数
         */
        export function _openScene(openName: string, zOder: number, cloesScene: Laya.Scene, func): void {
            Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene: Laya.Scene) {
                scene.width = Laya.stage.width;
                scene.height = Laya.stage.height;
                if (zOder) {
                    Laya.stage.addChildAt(scene, zOder);
                } else {
                    Laya.stage.addChild(scene);
                }
                scene.name = openName;
                _sceneControl[openName] = scene;
                // 背景图自适应
                let background = scene.getChildByName('background') as Laya.Image;
                if (background) {
                    background.width = Laya.stage.width;
                    background.height = Laya.stage.height;
                }
                // console.log('打开' + openName + '场景');
                if (cloesScene) {
                    cloesScene.close();
                }
                if (func) {
                    func();
                }
                // console.log(_sceneControl);
            }));
        }

        /**记录当前实际打开的场景名称，因为超过一定的关卡后，会循环当前的关卡，或者重玩之前的关卡*/
        export let openCustomName: string;
        /**记录实际打开的关卡数*/
        export let openLevelNum: number;
        /**
        * 打开与当前等级相匹配的关卡,包含游戏开始的一些参数
        **/
        export function _openGLCustoms(): void {
            let sceneName;
            let num;
            // 大于30关后从第一关开始循环
            if (lwg.Global._gameLevel > 30) {
                num = lwg.Global._gameLevel - 30;
            } else {
                num = lwg.Global._gameLevel;
            }
            openLevelNum = num;
            // 格式
            if (num <= 9) {
                sceneName = 'UIMain_00' + num;
            } else if (9 < num || num <= 99) {
                sceneName = 'UIMain_0' + num;
            }
            openCustomName = sceneName;
            console.log('打开', sceneName);
            _openScene(sceneName, null, null, f => {
                lwg.Global._gameStart = true;
            });
        }

        /**
        * 打开指定的关卡数,在开始游戏的时进行
        **/
        export function _openNumCustom(num): void {
            let sceneName;
            // 大于30关后从第一关开始循环
            if (num > 30) {
                num = num - 30;
            }
            openLevelNum = num;
            // 格式
            if (num <= 9) {
                sceneName = 'UIMain_00' + num;
            } else if (9 < num || num <= 99) {
                sceneName = 'UIMain_0' + num;
            }
            if (num <= 9) {
                sceneName = 'UIMain_00' + num;
            } else if (9 < num || num <= 99) {
                sceneName = 'UIMain_0' + num;
            }
            openCustomName = sceneName;
            console.log('打开' + sceneName);
            _openScene(sceneName, null, null, f => {
                lwg.Global._gameStart = true;
            });
        }

        /**
          * 当前实际打开的关卡数，不受等级控制，用于重玩之前的关卡。
          * 通过openLevelNum打开的场景
         **/
        export function _openLevelNumCustom(): void {
            let sceneName;
            // 格式
            if (openLevelNum <= 9) {
                sceneName = 'UIMain_00' + openLevelNum;
            } else if (9 < openLevelNum || openLevelNum <= 99) {
                sceneName = 'UIMain_0' + openLevelNum;
            }
            if (openLevelNum <= 9) {
                sceneName = 'UIMain_00' + openLevelNum;
            } else if (9 < openLevelNum || openLevelNum <= 99) {
                sceneName = 'UIMain_0' + openLevelNum;
            }
            openCustomName = sceneName;
            _openScene(sceneName, null, null, f => {
                lwg.Global._gameStart = true;
            });
        }

        /**打开下一关场景，并且上传信息
         * @param subEx 消耗多少体力值
        */
        export function _nextCustomScene(subEx): void {
            if (subEx > 0) {
                Global._execution -= subEx;
                let num = Global.ExecutionNumNode.getChildByName('Num') as Laya.FontClip;
                num.value = Global._execution.toString();
                Global._createHint_01(lwg.Enum.HintType.consumeEx);
                Global.createConsumeEx(subEx);
            }

            if (Admin.openLevelNum >= Global._gameLevel) {
                Admin._closeCustomScene();
                Global._gameLevel++;
                Admin._openGLCustoms();
            } else {
                Admin._closeCustomScene();
                Admin.openLevelNum++;
                Admin._openLevelNumCustom();
            }
            LocalStorage.addData();
        }

        /**
          * 刷新当前实际打开的关卡场景
          **/
        export function _refreshScene(): void {
            // let sceneName;
            // if (lwg.Global._gameLevel <= 9) {
            //     sceneName = 'UIMain_00' + lwg.Global._gameLevel;
            // } else if (9 < lwg.Global._gameLevel || lwg.Global._gameLevel <= 99) {
            //     sceneName = 'UIMain_0' + lwg.Global._gameLevel;
            // }
            _sceneControl[openCustomName].close();
            _openScene(openCustomName, null, null, null);
        }




        /**
        * 关闭当前实际打开的关卡场景
        **/
        export function _closeCustomScene(): void {
            console.log('关闭当前关卡' + openCustomName);
            // let sceneName;
            // if (gameLevel <= 9) {
            //     sceneName = 'UIMain_00' + gameLevel;
            // } else if (9 < gameLevel || gameLevel <= 99) {
            //     sceneName = 'UIMain_0' + gameLevel;
            // }
            _sceneControl[openCustomName].close();
        }

        /**场景打点次数*/
        let printPointNum: number = 0;
        /**
        * 场景打点,记录玩家进场景和出场景的次数
        * @param type 两种类型，一种是离开打点，一种是进入打点
        */
        export function printPoint(type, name: string): void {
            switch (name) {
                case SceneName.UILoding:
                    if (type === 'on') {
                        ADManager.TAPoint(TaT.PageEnter, 'UIPreload');
                    } else if (type === 'dis') {
                        ADManager.TAPoint(TaT.PageLeave, 'UIPreload');
                    }
                    break;
                case SceneName.UIStart:
                    if (type === 'on') {
                        ADManager.TAPoint(TaT.PageEnter, 'mianpage');
                    } else if (type === 'dis') {
                        ADManager.TAPoint(TaT.PageLeave, 'mianpage');
                    }
                    break;
                case SceneName.UIVictory:
                    if (type === 'on') {
                        ADManager.TAPoint(TaT.PageEnter, 'successpage');
                    } else if (type === 'dis') {
                        ADManager.TAPoint(TaT.PageLeave, 'successpage');
                    }
                    break;

                case SceneName.UIDefeated:
                    if (type === 'on') {
                        ADManager.TAPoint(TaT.PageEnter, 'failpage');
                    } else if (type === 'dis') {
                        ADManager.TAPoint(TaT.PageLeave, 'failpage');
                    }
                    break;

                case SceneName.UIExecutionHint:
                    if (type === 'on') {
                        ADManager.TAPoint(TaT.PageEnter, 'noticketpage');
                    } else if (type === 'dis') {
                        ADManager.TAPoint(TaT.PageLeave, 'noticketpage');
                    }
                    break;
                case SceneName.UIPassHint:
                    if (type === 'on') {
                        ADManager.TAPoint(TaT.PageEnter, 'freegiftpage');
                    } else if (type === 'dis') {
                        ADManager.TAPoint(TaT.PageLeave, 'freegiftpage');
                    }
                    break;
                case SceneName.UIPuase:
                    if (type === 'on') {
                        ADManager.TAPoint(TaT.PageEnter, 'pausepage');
                    } else if (type === 'dis') {
                        ADManager.TAPoint(TaT.PageLeave, 'pausepage');
                    }
                    break;
                default:

                    break;
            }
            // printPointNum++;
            // console.log('场景打点', printPointNum);
        }

        /**场景通用父类*/
        export class Scene extends Laya.Script {
            /**挂载当前脚本的节点*/
            self: Laya.Scene;
            calssName: string;
            constructor() {
                super();
            }
            onEnable() {
                this.self = this.owner as Laya.Scene;
                // 类名
                this.calssName = this['__proto__']['constructor'].name;
                this.gameState(this.calssName);
                // 组件变为的self属性
                this.self[this.calssName] = this;
                this.lwgInit();
                this.btnOnClick();
                this.adaptive();
                this.openAni();
                printPoint('on', this.calssName);
            }
            /**游戏当前的状态*/
            gameState(calssName): void {
                switch (calssName) {
                    case SceneName.UIStart:
                        _gameState = lwg.Enum.GameState.GameStart;
                        break;
                    case SceneName.UIMain:
                        _gameState = lwg.Enum.GameState.Play;
                        break;
                    case SceneName.UIDefeated:
                        _gameState = lwg.Enum.GameState.Defeated;
                        break;
                    case SceneName.UIVictory:
                        _gameState = lwg.Enum.GameState.Victory;
                        break;
                    default:
                        break;
                }
                // console.log(lwg.Admin._gameState);
            }
            /**初始化，在onEnable中执行，重写即可覆盖*/
            lwgInit(): void {
                // console.log('父类的初始化！');
            }
            /**点击事件注册*/
            btnOnClick(): void {
            }
            /**一些节点自适应*/
            adaptive(): void {
            }
            /**开场动画*/
            openAni(): void {
            }
            /**离场动画*/
            vanishAni(): void {
            }
            onDisable(): void {
                printPoint('dis', this.calssName);
                this.lwgDisable();
            }
            /**离开时执行，子类不执行onDisable，只执行lwgDisable*/
            lwgDisable(): void {

            }
        }

        /**角色通用父类*/
        export class Person extends Laya.Script {
            /**挂载当前脚本的节点*/
            self: Laya.Sprite;
            /**所在场景*/
            selfScene: Laya.Scene;
            /**物理组件*/
            rig: Laya.RigidBody;
            constructor() {
                super();
            }
            onEnable(): void {
                this.self = this.owner as Laya.Sprite;
                this.selfScene = this.self.scene;
                this.rig = this.self.getComponent(Laya.RigidBody);
                // 类名
                let calssName = this['__proto__']['constructor'].name;
                // 组件变为的self属性
                this.self[calssName] = this;
                this.lwgInit();
            }
            /**初始化，在onEnable中执行，重写即可覆盖*/
            lwgInit(): void {
                console.log('父类的初始化！');
            }
        }

        /**物件通用父类*/
        export class Object extends Laya.Script {
            /**挂载当前脚本的节点*/
            self: Laya.Sprite;
            /**所在场景*/
            selfScene: Laya.Scene;
            /**物理组件*/
            rig: Laya.RigidBody;
            constructor() {
                super();
            }
            onEnable(): void {
                this.self = this.owner as Laya.Sprite;
                this.selfScene = this.self.scene;
                // 类名
                let calssName = this['__proto__']['constructor'].name;
                // 组件变为的self属性
                this.self[calssName] = this;
                this.rig = this.self.getComponent(Laya.RigidBody);
                this.lwgInit();
            }
            /**初始化，在onEnable中执行，重写即可覆盖*/
            lwgInit(): void {
                console.log('父类的初始化！');
            }

            onUpdate(): void {
                this.lwgOnUpdate();
            }
            lwgOnUpdate(): void {

            }
            onDisable(): void {

            }

            /**离开时执行，子类不执行onDisable，只执行lwgDisable*/
            lwgDisable(): void {

            }

        }
    }

    export module Effects {
        /**特效元素的图片地址，所有项目都可用*/
        export enum SkinUrl {
            'Effects/cir_white.png',
            "Effects/cir_black.png",
            "Effects/cir_blue.png",
            "Effects/cir_bluish.png",
            "Effects/cir_cyan.png",
            "Effects/cir_grass.png",
            "Effects/cir_green.png",
            "Effects/cir_orange.png",
            "Effects/cir_pink.png",
            "Effects/cir_purple.png",
            "Effects/cir_red.png",
            "Effects/cir_yellow.png",

            "Effects/star_black.png",
            "Effects/star_blue.png",
            "Effects/star_bluish.png",
            "Effects/star_cyan.png",
            "Effects/star_grass.png",
            "Effects/star_green.png",
            "Effects/star_orange.png",
            "Effects/star_pink.png",
            "Effects/star_purple.png",
            "Effects/star_red.png",
            "Effects/star_white.png",
            "Effects/star_yellow.png",
            "Effects/icon_biggold.png"
        }

        /**类粒子特效的通用父类*/
        export class EffectsBase extends Laya.Script {
            /**挂载当前脚本的节点*/
            self: Laya.Sprite;
            /**所在场景*/
            selfScene: Laya.Scene;
            /**移动开关*/
            moveSwitch: boolean;
            /**时间线*/
            timer: number;
            /**在组中的位置*/
            group: number;
            /**在行中的位置*/
            row: number;
            /**在列中的位置*/
            line: number;
            /**初始角度*/
            startAngle: number;
            /**基础速度*/
            startSpeed: number;
            /**加速度*/
            accelerated: number;

            /**随机大小*/
            startScale: number;
            /**随机起始透明度*/
            startAlpha: number;
            /**初始角度*/
            startRotat: number;


            /**随机旋转方向*/
            startDir: number;
            /**随机消失时间*/
            vanishTime: number;

            onEnable(): void {
                this.self = this.owner as Laya.Sprite;
                this.selfScene = this.self.scene;
                let calssName = this['__proto__']['constructor'].name;
                this.self[calssName] = this;
                this.self.pivotX = this.self.width / 2;
                this.self.pivotY = this.self.height / 2;
                this.timer = 0;
                this.lwgInit();
                this.initProperty();
                this.propertyAssign();
            }
            /**初始化，在onEnable中执行，重写即可覆盖*/
            lwgInit(): void {
            }
            /**初始化特效单元的属性*/
            initProperty(): void {
            }
            /**一些节点上的初始属性赋值*/
            propertyAssign(): void {
                if (this.startAlpha) {
                    this.self.alpha = this.startAlpha;
                }
                if (this.startScale) {
                    this.self.scale(this.startScale, this.startScale);
                }
                if (this.startRotat) {
                    this.self.rotation = this.startRotat;
                }
            }
            /**
              * 通用按角度移动移动，按单一角度移动
              * @param angle 角度
              * @param basedSpeed 基础速度
              */
            commonSpeedXYByAngle(angle, speed) {
                this.self.x += Tools.speedXYByAngle(angle, speed + this.accelerated).x;
                this.self.y += Tools.speedXYByAngle(angle, speed + this.accelerated).y;
            }
            /**移动规则*/
            moveRules(): void {
            }
            onUpdate(): void {
                this.moveRules();
            }
            onDisable(): void {
                Laya.Pool.recover(this.self.name, this.self);
            }
        }

        /**
         * 创建普通爆炸动画，四周爆炸随机散开
         * @param parent 父节点
         * @param quantity 数量
         * @param x X轴位置
         * @param y Y轴位置
         */
        export function createCommonExplosion(parent, quantity, x, y): void {
            for (let index = 0; index < quantity; index++) {
                let ele = Laya.Pool.getItemByClass('ele', Laya.Image) as Laya.Image;
                ele.name = 'ele';//标识符和名称一样
                let num = Math.floor(Math.random() * 12);
                ele.alpha = 1;
                ele.skin = SkinUrl[num];
                parent.addChild(ele);
                ele.pos(x, y);
                let scirpt = ele.getComponent(commonExplosion);
                if (!scirpt) {
                    ele.addComponent(commonExplosion);
                }
            }
        }

        /**普通爆炸移动类*/
        export class commonExplosion extends lwg.Effects.EffectsBase {
            initProperty(): void {
                this.startAngle = 360 * Math.random();
                this.startSpeed = 5 * Math.random() + 8;
                this.startScale = 0.4 + Math.random() * 0.6;
                this.accelerated = 0.1;
                this.vanishTime = 8 + Math.random() * 10;
            }
            moveRules(): void {
                this.timer++;
                if (this.timer >= this.vanishTime / 2) {
                    this.self.alpha -= 0.15;
                }
                if (this.timer >= this.vanishTime) {
                    this.self.removeSelf();
                } else {
                    this.commonSpeedXYByAngle(this.startAngle, this.startSpeed + this.accelerated);
                }
            }
        }

        /**
         * 创建单个金币动画
         * @param parent 父节点
         * @param quantity 数量
         * @param x X轴位置
         * @param y Y轴位置
         * @param targeX 目标X位置
         * @param targeY 目标Y位置
         */
        export function createAddGold(parent, index, x, y, targetX, targetY, func): void {
            let delayed = 0;
            let ele = Laya.Pool.getItemByClass('addGold', Laya.Image) as Laya.Image;
            ele.name = 'addGold';//标识符和名称一样
            let num = Math.floor(Math.random() * 12);
            ele.alpha = 1;
            ele.skin = SkinUrl[24];
            parent.addChild(ele);
            ele.zOrder = 60;
            ele.pos(x, y);
            let scirpt = ele.getComponent(AddGold);
            if (!scirpt) {
                ele.addComponent(AddGold);
                let scirpt1 = ele.getComponent(AddGold);
                scirpt1.line = index;
                scirpt1.targetX = targetX;
                scirpt1.targetY = targetY;
                scirpt1.timer -= index * 3;
                scirpt1.moveSwitch = true;
                scirpt1.func = func;
            } else {
                scirpt.line = index;
                scirpt.timer -= index * 3;
                scirpt.targetX = targetX;
                scirpt.targetY = targetY;
                scirpt.moveSwitch = true;
                scirpt.func = func;
            }
        }

        /**炸开后再前往同一个地点，用于金币增加动画*/
        export class AddGold extends lwg.Effects.EffectsBase {
            /**属于那一列*/
            line: number;
            /**目标位置X*/
            targetX: number;
            /**目标位置Y*/
            targetY: number;
            /**回调函数*/
            func: any
            initProperty(): void {
            }
            moveRules(): void {
                if (this.moveSwitch) {
                    this.timer++;
                    if (this.timer > 0) {
                        lwg.Animation.move_Simple(this.self, this.self.x, this.self.y, this.targetX, this.targetY, 250, 0, f => {
                            this.self.removeSelf();
                            if (this.func !== null) {
                                this.func();
                            }
                        });
                        this.moveSwitch = false;
                    }
                }
            }
        }


        /**
          * 创建普通爆炸动画，四周爆炸随机散开
          * @param parent 父节点
          * @param quantity 数量
          * @param x X轴位置
          * @param y Y轴位置
          */
        export function createFireworks(parent, quantity, x, y): void {
            for (let index = 0; index < quantity; index++) {
                let ele = Laya.Pool.getItemByClass('fireworks', Laya.Image) as Laya.Image;
                ele.name = 'fireworks';//标识符和名称一样
                let num = Math.floor(Math.random() * 12);
                ele.alpha = 1;
                ele.skin = SkinUrl[num];
                parent.addChild(ele);
                ele.pos(x, y);
                let scirpt = ele.getComponent(Fireworks);
                if (!scirpt) {
                    ele.addComponent(Fireworks);
                }
            }
        }

        /**类似烟花爆炸，速度逐渐减慢，并且有下降趋势*/
        export class Fireworks extends lwg.Effects.EffectsBase {
            initProperty(): void {
                this.startAngle = 360 * Math.random();
                this.startSpeed = 5 * Math.random() + 5;
                this.startScale = 0.4 + Math.random() * 0.6;
                this.accelerated = 0.1;
                this.vanishTime = 200 + Math.random() * 10;
            }
            moveRules(): void {
                this.timer++;
                if (this.timer >= this.vanishTime * 3 / 5) {
                    this.self.alpha -= 0.1;
                }
                if (this.timer >= this.vanishTime) {
                    this.self.removeSelf();
                } else {
                    this.commonSpeedXYByAngle(this.startAngle, this.startSpeed + this.accelerated);
                }
                if (this.self.scaleX < 0) {
                    this.self.scaleX += 0.01;
                } else if (this.self.scaleX >= this.startScale) {
                    this.self.scaleX -= 0.01;
                }
            }
        }

        /**
         * 创建左右喷彩带动画
         * @param parent 父节点
         * @param direction 方向
         * @param quantity 数量
         * @param x X轴位置
         * @param y Y轴位置
        */
        export function createLeftOrRightJet(parent, direction, quantity, x, y): void {
            for (let index = 0; index < quantity; index++) {
                let ele = Laya.Pool.getItemByClass('Jet', Laya.Image) as Laya.Image;
                ele.name = 'Jet';//标识符和名称一样
                let num = 12 + Math.floor(Math.random() * 11);
                ele.skin = SkinUrl[num];
                ele.alpha = 1;
                parent.addChild(ele);
                ele.pos(x, y);
                let scirpt = ele.getComponent(leftOrRightJet);
                if (!scirpt) {
                    ele.addComponent(leftOrRightJet);
                    let scirpt1 = ele.getComponent(leftOrRightJet);
                    scirpt1.direction = direction;
                    scirpt1.initProperty();
                } else {
                    scirpt.direction = direction;
                    scirpt.initProperty();
                }
            }
        }
        /**创建左右喷彩带动画类*/
        export class leftOrRightJet extends lwg.Effects.EffectsBase {
            direction: string;
            randomRotate: number;
            initProperty(): void {
                if (this.direction === 'left') {
                    this.startAngle = 100 * Math.random() - 90 + 45 - 10 - 20;
                } else if (this.direction === 'right') {
                    this.startAngle = 100 * Math.random() + 90 + 45 + 20;
                }
                this.startSpeed = 10 * Math.random() + 3;
                this.startScale = 0.4 + Math.random() * 0.6;
                this.accelerated = 0.1;
                this.vanishTime = 300 + Math.random() * 50;
                this.randomRotate = 1 + Math.random() * 20;
            }
            moveRules(): void {
                this.timer++;
                if (this.timer >= this.vanishTime * 3 / 5) {
                    this.self.alpha -= 0.1;
                }
                if (this.timer >= this.vanishTime) {
                    this.self.removeSelf();
                } else {
                    this.commonSpeedXYByAngle(this.startAngle, this.startSpeed + this.accelerated);
                    this.self.y += this.accelerated * 10;
                }

                this.self.rotation += this.randomRotate;

                if (this.self.scaleX < 0) {
                    this.self.scaleX += 0.01;
                } else if (this.self.scaleX >= this.startScale) {
                    this.self.scaleX -= 0.01;
                }
            }
        }
    }


    /**加载一些骨骼动画，在loding界面出现的时候执行skLoding()方法*/
    export module Sk {

        /**公主骨骼动画*/
        export let gongzhuTem: Laya.Templet = new Laya.Templet();
        export let aishaTem: Laya.Templet = new Laya.Templet();
        export let changeTem: Laya.Templet = new Laya.Templet();
        export let chijiTem: Laya.Templet = new Laya.Templet();
        export let huiguniangTem: Laya.Templet = new Laya.Templet();
        export let tianshiTem: Laya.Templet = new Laya.Templet();
        export let xiaohongmaoTem: Laya.Templet = new Laya.Templet();
        export let xiaohuangyaTem: Laya.Templet = new Laya.Templet();
        export let zhenziTem: Laya.Templet = new Laya.Templet();

        /**王子骨骼动画*/
        export let wangziTem: Laya.Templet = new Laya.Templet();
        /**狗骨骼动画*/
        export let gouTem: Laya.Templet = new Laya.Templet();
        /**情敌1*/
        export let qingdi_01Tem: Laya.Templet = new Laya.Templet();
        /**情敌2*/
        export let qingdi_02Tem: Laya.Templet = new Laya.Templet();
        /**后妈*/
        export let houmaTem: Laya.Templet = new Laya.Templet();
        /**猴子*/
        export let houziTem: Laya.Templet = new Laya.Templet();

        export function skLoding(): void {
            createGongzhuTem();
            createAishaTem();
            createChijiTem();
            createChangeTem()
            createHuiguniangTem();
            createTianshiTem();
            createXiaohongmaoTem();
            createXiaohuangyaTem();
            createZhenziTem();

            createWangziTem();
            createGouTem();
            createQingdi_01Tem();
            createQingdi_02Tem();
            createHoumaTem();
            createHouziTem();
        }

        /**全部加载*/
        export function createGongzhuTem(): void {
            gongzhuTem.on(Laya.Event.COMPLETE, this, onCompelet);
            gongzhuTem.on(Laya.Event.ERROR, this, onError);
            gongzhuTem.loadAni("SK/gongzhu.sk");
        }
        export function createAishaTem(): void {
            aishaTem.on(Laya.Event.COMPLETE, this, onCompelet);
            aishaTem.on(Laya.Event.ERROR, this, onError);
            aishaTem.loadAni("SK/aisha.sk");
        }
        export function createChangeTem(): void {
            changeTem.on(Laya.Event.COMPLETE, this, onCompelet);
            changeTem.on(Laya.Event.ERROR, this, onError);
            changeTem.loadAni("SK/change.sk");
        }
        export function createChijiTem(): void {
            chijiTem.on(Laya.Event.COMPLETE, this, onCompelet);
            chijiTem.on(Laya.Event.ERROR, this, onError);
            chijiTem.loadAni("SK/chiji.sk");
        }
        export function createHuiguniangTem(): void {
            huiguniangTem.on(Laya.Event.COMPLETE, this, onCompelet);
            huiguniangTem.on(Laya.Event.ERROR, this, onError);
            huiguniangTem.loadAni("SK/huiguniang.sk");
        }
        export function createTianshiTem(): void {
            tianshiTem.on(Laya.Event.COMPLETE, this, onCompelet);
            tianshiTem.on(Laya.Event.ERROR, this, onError);
            tianshiTem.loadAni("SK/tianshi.sk");
        }
        export function createXiaohongmaoTem(): void {
            xiaohongmaoTem.on(Laya.Event.COMPLETE, this, onCompelet);
            xiaohongmaoTem.on(Laya.Event.ERROR, this, onError);
            xiaohongmaoTem.loadAni("SK/xiaohongmao.sk");
        }
        export function createXiaohuangyaTem(): void {
            xiaohuangyaTem.on(Laya.Event.COMPLETE, this, onCompelet);
            xiaohuangyaTem.on(Laya.Event.ERROR, this, onError);
            xiaohuangyaTem.loadAni("SK/xiaohuangya.sk");
        }
        export function createZhenziTem(): void {
            zhenziTem.on(Laya.Event.COMPLETE, this, onCompelet);
            zhenziTem.on(Laya.Event.ERROR, this, onError);
            zhenziTem.loadAni("SK/zhenzi.sk");
        }


        export function createWangziTem(): void {
            wangziTem.on(Laya.Event.COMPLETE, this, onCompelet);
            wangziTem.on(Laya.Event.ERROR, this, onError);
            wangziTem.loadAni("SK/wangzi.sk");
        }
        export function createGouTem(): void {
            gouTem.on(Laya.Event.COMPLETE, this, onCompelet);
            gouTem.on(Laya.Event.ERROR, this, onError);
            gouTem.loadAni("SK/gou.sk");
        }
        export function createQingdi_01Tem(): void {
            qingdi_01Tem.on(Laya.Event.COMPLETE, this, onCompelet);
            qingdi_01Tem.on(Laya.Event.ERROR, this, onError);
            qingdi_01Tem.loadAni("SK/qingdi.sk");
        }
        export function createQingdi_02Tem(): void {
            qingdi_02Tem.on(Laya.Event.COMPLETE, this, onCompelet);
            qingdi_02Tem.on(Laya.Event.ERROR, this, onError);
            qingdi_02Tem.loadAni("SK/qingdi1.sk");
        }
        export function createHoumaTem(): void {
            houmaTem.on(Laya.Event.COMPLETE, this, onCompelet);
            houmaTem.on(Laya.Event.ERROR, this, onError);
            houmaTem.loadAni("SK/houma.sk");
        }
        export function createHouziTem(): void {
            houziTem.on(Laya.Event.COMPLETE, this, onCompelet);
            houziTem.on(Laya.Event.ERROR, this, onError);
            houziTem.loadAni("SK/houzi.sk");
        }
        export function onCompelet(tem: Laya.Templet): void {
            console.log(tem['_skBufferUrl'], '加载成功');

        }
        export function onError(url): void {
            console.log(url, '加载失败！');
        }
    }

    /**枚举，常量*/
    export module Enum {
        /**提示文字的类型描述*/
        export enum HintDec {
            '金币不够了！',
            '没有可以卖的皮肤了！',
            '暂时没有广告，过会儿再试试吧！',
            '暂无皮肤!',
            '暂无分享!',
            '暂无提示机会!',
            '观看完整广告才能获取奖励哦！',
            '没有过关哦，再接再厉！',
            '分享成功后才能获取奖励！',
            '分享成功',
            '暂无视频，玩一局游戏之后分享！',
            '消耗2点体力！',
            '今日体力福利已领取！',
            '分享成功，获得125金币！',
        }

        /**提示类型*/
        export enum HintType {
            'noGold',
            'noGetPifu',
            'noAdv',
            'noPifu',
            'noShare',
            'noHint',
            'lookend',
            'nopass',
            'sharefail',
            'sharesuccess',
            'novideo',
            'consumeEx',
            'no_exemptExTime',
            'shareyes'
        }
        /**皮肤的顺序以及名称*/
        export enum PifuOrder {
            '01_gongzhu', '02_chiji', '03_change', '04_huiguniang', '05_tianshi', '06_xiaohongmao', '07_xiaohuangya', '08_zhenzi', '09_aisha'
        }
        /**皮肤的顺序以及名称*/
        export enum PifuAllName {
            '01_gongzhu', '02_chiji', '03_change', '04_huiguniang', '05_tianshi', '06_xiaohongmao', '07_xiaohuangya', '08_zhenzi', '09_aisha'
        }
        /**皮肤图片顺序对应的地址*/
        export enum PifuSkin {
            'pifu/pifu_01_gongzhu.png',
            'pifu/pifu_02_chiji.png',
            'pifu/pifu_03_change.png',
            'pifu/pifu_04_huiguniang.png',
            'pifu/pifu_05_tianshi.png',
            'pifu/pifu_06_xiaohongmao.png',
            'pifu/pifu_07_xiaohuangya.png',
            'pifu/pifu_08_zhenzi.png',
            'pifu/pifu_09_aisha.png'
        }

        /**灰色皮肤顺序对应的地址*/
        export enum PifuSkin_No {
            'pifu/pifu_01_gongzhu_h.png',
            'pifu/pifu_02_chiji_h.png',
            'pifu/pifu_03_change_h.png',
            'pifu/pifu_04_huiguniang_h.png',
            'pifu/pifu_05_tianshi_h.png',
            'pifu/pifu_06_xiaohongmao_h.png',
            'pifu/pifu_07_xiaohuangya_h.png',
            'pifu/pifu_08_lzhenzi_h.png',
            'pifu/pifu_09_aisha_h.png'
        }

        // /**点击事件类型*/
        // export enum ClickType {
        //     /**无效果*/
        //     noEffect = 'noEffect',
        //     /**点击放大*/
        //     largen = 'largen',
        //     /**类似气球*/
        //     balloon = 'balloon',
        //     /**小虫子*/
        //     beetle = 'beetle',
        // }

        /**音效*/
        export enum voiceUrl {
            btn = 'voice/btn.wav',
            bgm = 'voice/bgm.mp3',
            victory = 'voice/guoguan.wav',
            defeated = 'voice/wancheng.wav',
        }

        /**皮肤的顺序以及名称*/
        export enum PifuAllName_Ch {
            '同桌',
            '小恐龙',
            '雪人',
            '啾啾',
            '小芊',
            '麦尔',
            '棒球小子',
            '陆肥',
            '英雄'
        }


        /**任务类型*/
        export enum TaskType {
            /**颠起*/
            topUp = 'topUp',
            /**移动*/
            move = 'move',
            /**坚持时间*/
            continue = 'continue',
            /**吃金币*/
            gold = 'gold',
        }

        /**角色的四个方向*/
        export enum PersonDir {
            up = 'up',
            down = 'down',
            left = 'left',
            right = 'right',
        }

        /**当前所有场景的名称*/
        export enum SceneName {
            UILoding = 'UILoding',
            UIMain = 'UIMain',
            UIStart = 'UIStart',
            UITask = 'UITask',
            UIVictory = 'UIVictory',
            UIDefeated = 'UIDefeated'
        }

        /**游戏当前的状态*/
        export enum GameState {
            /**开始界面*/
            GameStart = 'GameStart',
            /**游戏中*/
            Play = 'Play',
            /**暂停中*/
            Pause = 'pause',
            /**胜利*/
            Victory = 'victory',
            /**失败*/
            Defeated = 'defeated',
        }

        /**角色当前的状态，状态唯一，状态不会改变移动方向，需要手动改*/
        export enum MoveState {
            /**在梯子上，优先级最高*/
            onFloor = 'onFloor',
            /**在梯子上，优先级第二*/
            onLadder = 'onLadder',
            /**在梯子上，优先级最后*/
            inAir = 'inAir'
        }

        /**角色当前的buff状态*/
        export enum BuffState {
            /**拿着棍子*/
            stick = 'stick',
            /**拿着水壶*/
            kettle = 'kettle',
        }

        /**房子的颜色*/
        export enum RoomColor {
            blue = 'blue',
            bluish = 'bluish',
            grass = 'grass',
            green = 'green',
            pink = 'pink',
            purple = 'purple',
            red = 'red',
            yellow = 'yellow',
            yellowish = 'yellowish'
        }

        /**房子的皮肤地址*/
        export enum RoomSkin {
            blue = 'Room/room_blue.png',
            bluish = 'Room/room_bluish.png',
            grass = 'Room/room_grass.png',
            green = 'Room/room_green.png',
            pink = 'Room/room_pink.png',
            purple = 'Room/room_purple.png',
            red = 'Room/room_red.png',
            yellow = 'Room/room_yellow.png',
            yellowish = 'Room/room_yellowish.png'
        }

        /**通道上的墙壁的皮肤地址*/
        export enum WallSkin {
            blue = 'Room/room_blue_wall.png',
            bluish = 'Room/room_bluish_wall.png',
            grass = 'Room/room_grass_wall.png',
            green = 'Room/room_green_wall.png',
            pink = 'Room/room_pink_wall.png',
            purple = 'Room/room_purple_wall.png',
            red = 'Room/room_red_wall.png',
            yellow = 'Room/room_yellow_wall.png',
            yellowish = 'Room/room_yellowish_wall.png'
        }

        /**通道颜色的皮肤地址*/
        export enum AisleColorSkin {
            blue = 'Room/room_blue_color.png',
            bluish = 'Room/room_bluish_color.png',
            grass = 'Room/room_grass_color.png',
            green = 'Room/room_green_color.png',
            pink = 'Room/room_pink_color.png',
            purple = 'Room/room_purple_color.png',
            red = 'Room/room_red_color.png',
            yellow = 'Room/room_yellow_color.png',
            yellowish = 'Room/room_yellowish_color.png'
        }

        /**公主的动画类型*/
        export enum gongzhuAni {
            /**行走*/
            walk = "walk",
            /**死亡*/
            die = "die",
            die_xianglian = "die_xianglian",
            /**带着棍棒走路*/
            walk_gun = "walk_gun",
            walk_shuihu = "walk_shuihu",
            walk_xianglian = "walk_xianglian",
            /**棍棒攻击*/
            attack_gun = "attack_gun",
            attack_shuihu = "attack_shuihu",
            /**棍棒攻击*/
            win = 'win',
            win_xianglian = "win_xianglian"
        }

        /**狗的动画类型*/
        export enum dogAni {
            standby = "standby",
            walk = "walk",
            die = "die",
        }

        /**狗的动画类型*/
        export enum wangziAni {
            standby = "standby",
            win = "win",
            walk = "walk",
        }

        /**公主的动画类型*/
        export enum houseAni {
            box_01_open = "box_01_open",
            box_02_open = "box_02_open",
            box_01_static = "box_01_static",
            box_02_static = "box_02_static"
        }
    }

    /**
    * 1.这里导出的是模块不是类，没有this，所以此模块的回调函数要写成func=>{}这种箭头函数，箭头函数会把{}里面的this指向原来的this。
    * 2.点击事件模块
    */
    export module Click {

        /**点击事件类型*/
        export enum ClickType {
            /**无效果*/
            noEffect = 'noEffect',
            /**点击放大*/
            largen = 'largen',
            /**类似气球*/
            balloon = 'balloon',
            /**小虫子*/
            beetle = 'beetle',
        }

        /**音乐的url*/
        export let audioUrl: string;
        /**
         * 当前气球被缩放的比例
         * */
        export let balloonScale;
        /**
        * 当前小甲虫被缩放的比例
        * */
        export let beetleScale;
        /**b
         * 点击事件注册,传函数名的时候不要用func=>因为这是传函数不是函数名
         * @param effect 效果类型 1.'largen'
         * @param soundUrl 音效的地址
         * @param target 节点
         * @param caller 指向脚本（this）引用
         * @param down 按下函数
         * @param move 移动函数
         * @param up 抬起函数
         * @param out 出屏幕函数
         * 以上4个只是函数名，不可传递函数，如果没有特殊执行，那么就用此模块定义的4个函数，包括通用效果。
         */
        export function on(effect, audioUrl, target, caller, down, move, up, out): void {
            let btnEffect;
            if (audioUrl) {
                Click.audioUrl = audioUrl;
            } else {
                Click.audioUrl = Enum.voiceUrl.btn;
            }
            switch (effect) {
                case ClickType.noEffect:
                    btnEffect = new Btn_NoEffect();
                    break;
                case ClickType.largen:
                    btnEffect = new Btn_LargenEffect();
                    break;
                case ClickType.balloon:
                    btnEffect = new Btn_Balloon();
                    break;
                case ClickType.balloon:
                    btnEffect = new Btn_Beetle();
                    break;
                default:
                    btnEffect = new Btn_LargenEffect();
                    break;
            }
            target.on(Laya.Event.MOUSE_DOWN, caller, down === null ? btnEffect.down : down);
            target.on(Laya.Event.MOUSE_MOVE, caller, move === null ? btnEffect.move : move);
            target.on(Laya.Event.MOUSE_UP, caller, up === null ? btnEffect.up : up);
            target.on(Laya.Event.MOUSE_OUT, caller, out === null ? btnEffect.out : out);
        }

        /**
         * 点击事件的关闭
        * @param effect 效果类型 1.'largen'
         * @param target 节点
         * @param caller 指向脚本（this）引用
         * @param down 按下函数
         * @param move 移动函数
         * @param up 抬起函数
         * @param out 出屏幕函数
         * 以上4个只是函数名，不可传递函数，如果没有特殊执行，那么就用此模块定义的4个函数，包括通用效果。
         */
        export function off(effect, target, caller, down, move, up, out): void {
            let btnEffect;
            switch (effect) {
                case 'largen':
                    btnEffect = new Btn_LargenEffect();
                    break;
                case 'balloon':
                    btnEffect = new Btn_Balloon();
                    break;
                case 'beetle':
                    btnEffect = new Btn_Beetle();
                    break;
                default:
                    break;
            }
            btnPrintPoint('on', target);

            target.off(Laya.Event.MOUSE_DOWN, caller, down === null ? btnEffect.down : down);
            target.off(Laya.Event.MOUSE_MOVE, caller, move === null ? btnEffect.move : move);
            target.off(Laya.Event.MOUSE_UP, caller, up === null ? btnEffect.up : up);
            target.off(Laya.Event.MOUSE_OUT, caller, out === null ? btnEffect.out : out);
        }
    }

    let btnPrintNum: number = 0;
    /**
     * 按钮打点，记录玩家点击的次数
     * @param type 按钮是进入时打点还是点击时打点
     * @param name 按钮名称
     * */
    export function btnPrintPoint(type, target): void {
        switch (target) {
            // 游戏界面
            case lwg.Global.BtnPauseNode:
                if (type === 'on') {
                    ADManager.TAPoint(TaT.BtnShow, 'pausebt_play');
                } else if (type === 'dis') {
                    ADManager.TAPoint(TaT.BtnClick, 'pausebt_play');
                }
                break;
            case lwg.Global.BtnHintNode:
                if (type === 'on') {
                    ADManager.TAPoint(TaT.BtnShow, 'ADrwardbt_play');
                } else if (type === 'dis') {
                    ADManager.TAPoint(TaT.BtnClick, 'ADrwardbt_play');
                }
                break;
            case lwg.Global.BtnAgainNode:
                if (type === 'on') {
                    ADManager.TAPoint(TaT.BtnShow, 'returnbt_play');
                } else if (type === 'dis') {
                    ADManager.TAPoint(TaT.BtnClick, 'returnbt_play');
                }
                break;

            default:
                break;
        }
        // btnPrintNum++;
        // console.log('按钮打点' + btnPrintNum);
    }

    /**
     * 没有效果的点击事件，有时候用于防止界面的事件穿透
     */
    export class Btn_NoEffect {
        constructor() {
        }
        /**按下*/
        down(event): void {
            console.log('无点击效果的点击');
        }
        /**移动*/
        move(event): void {
        }
        /**抬起*/
        up(event): void {
        }
        /**出屏幕*/
        out(event): void {
        }
    }

    /**
     * 点击放大的按钮点击效果,每个类是一种效果，和点击的声音一一对应
     */
    export class Btn_LargenEffect {
        constructor() {
        }
        /**按下*/
        down(event): void {
            event.currentTarget.scale(1.1, 1.1);
            if (lwg.Global._voiceSwitch) {
                Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
            }
        }
        /**移动*/
        move(event): void {
            event.currentTarget.scale(1, 1);
        }

        /**抬起*/
        up(event): void {
            event.currentTarget.scale(1, 1);
            btnPrintPoint('on', event.currentTarget.name);
        }


        /**出屏幕*/
        out(event): void {
            event.currentTarget.scale(1, 1);
        }
    }

    /**
     * 气球的点击效果
     */
    export class Btn_Balloon {
        constructor() {
        }
        /**按下*/
        down(event): void {
            event.currentTarget.scale(Click.balloonScale + 0.06, Click.balloonScale + 0.06);
            Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
        }
        /**抬起*/
        up(event): void {
            event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
        }
        /**移动*/
        move(event): void {
            event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
        }
        /**出屏幕*/
        out(event): void {
            event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
        }
    }

    /**
     * 气球的点击效果
     */
    export class Btn_Beetle {
        constructor() {
        }
        /**按下*/
        down(event): void {
            event.currentTarget.scale(Click.beetleScale + 0.06, Click.beetleScale + 0.06);
            Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
        }
        /**抬起*/
        up(event): void {
            event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
        }
        /**移动*/
        move(event): void {
            event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
        }
        /**出屏幕*/
        out(event): void {
            event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
        }
    }


    /**动画模块*/
    export module Animation {
        /**
          * 按中心点旋转动画
          * @param node 节点
          * @param Frotate 初始角度
          * @param Erotate 最终角度
          * @param time 花费时间
        */
        export function simple_Rotate(node, Frotate, Erotate, time, func): void {
            node.rotation = Frotate;
            Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), 0);
        }

        /**
         * 上下翻转动画
         * @param node 节点
         * @param time 花费时间
         */
        export function upDown_Overturn(node, time, func): void {
            Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), 0);
        }

        /**
         * 上下旋转动画
         * @param node 节点
         * @param time 花费时间
         * @param func 回调函数
         */
        export function leftRight_Overturn(node, time, func): void {
            Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        }), 0);
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), 0);
            }), 0);
        }

        /**
         * 左右抖动
         * @param node 节点
         * @param range 幅度
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
         */
        export function leftRight_Shake(node, range, time, delayed, func): void {
            Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                // PalyAudio.playSound(Enum.AudioName.commonShake, 1);
                Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                    // PalyAudio.playSound(Enum.AudioName.commonShake, 1);
                    Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }))
                }))
            }), delayed);
        }

        /**
         * 上下抖动
         * @param node 节点
         * @param range 幅度
         * @param time 花费时间
         * @param delayed 延迟时间
         * @param func 回调函数
         */
        export function upDwon_Shake(node, range, time, delayed, func): void {
            Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }))
                }))
            }), delayed)
        }

        /**
         * 渐隐渐出
         * @param node 节点
         * @param alpha1 最初的透明度
         * @param alpha2 渐隐到的透明度
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
         */
        export function fadeOut(node, alpha1, alpha2, time, delayed, func): void {
            node.alpha = alpha1;
            Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
         * 渐出
         * @param node 节点
         * @param alpha1 最初的透明度
         * @param alpha2 渐隐到的透明度
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
         */
        export function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func): void {
            node.alpha = alpha1;
            Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
        * 渐出+移动，起始位置都是0，最终位置都是1
        * @param node 节点
        * @param firstX 初始x位置
        * @param firstY 初始y位置
        * @param targetX x轴移动位置
        * @param targetY y轴移动位置
        * @param time 花费时间
        * @param delayed 延时
        * @param func 回调函数
        */
        export function move_FadeOut(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.alpha = 0;
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
         * 渐隐+移动，起始位置都是1，最终位置都是0
         * @param node 节点
         * @param firstX 初始x位置
         * @param firstY 初始y位置
         * @param targetX x轴目标位置
         * @param targetY y轴目标位置
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
        */
        export function move_Fade_Out(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.alpha = 1;
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { alpha: 0, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
        * 渐出+移动+缩放，起始位置都是0，最终位置都是1
        * @param node 节点
        * @param firstX 初始x位置
        * @param firstY 初始y位置
        * @param targetX x轴移动位置
        * @param targetY y轴移动位置
        * @param time 花费时间
        * @param delayed 延时
        * @param func 回调函数
        */
        export function move_FadeOut_Scale_01(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.alpha = 0;
            node.targetX = 0;
            node.targetY = 0;
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
         * 移动+缩放，起始位置都是0，最终位置都是1
         * @param node 节点
         * @param fScale 初始大小
         * @param fX 初始x位置
         * @param fY 初始y位置
         * @param tX x轴移动位置
         * @param tY y轴移动位置
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
         */
        export function move_Scale(node, fScale, fX, fY, tX, tY, eScale, time, delayed, func): void {
            node.scaleX = fScale;
            node.scaleY = fScale;
            node.x = fX;
            node.y = fY;
            Laya.Tween.to(node, { x: tX, y: tY, scaleX: eScale, scaleY: eScale }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
         * 简单下落
         * @param node 节点
         * @param targetY 目标位置
         * @param rotation 落地角度
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 回调函数
         */
        export function drop_Simple(node, targetY, rotation, time, delayed, func): void {

            Laya.Tween.to(node, { y: targetY, rotation: rotation }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed);
        }

        /**
          * 下落回弹动画 ，类似于连丝蜘蛛下落，下落=》低于目标位置=》回到目标位置
          * @param target 目标
          * @param fAlpha 初始透明度
          * @param firstY 初始位置
          * @param targetY 目标位置
          * @param extendY 延伸长度
          * @param time1 第一阶段花费时间
          * @param time2 第二阶段花费时间
          * @param delayed 延时时间
          * @param func 结束回调函数
          * */
        export function drop_KickBack(target, fAlpha, firstY, targetY, extendY, time1, delayed, func): void {

            target.alpha = fAlpha;
            target.y = firstY;

            Laya.Tween.to(target, { alpha: 1, y: targetY + extendY }, time1, Laya.Ease.expoIn, Laya.Handler.create(this, function () {

                Laya.Tween.to(target, { y: targetY - extendY / 2 }, time1 / 2, null, Laya.Handler.create(this, function () {

                    Laya.Tween.to(target, { y: targetY }, time1 / 4, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
         * 偏移下落,模仿抛物线
         * @param node 节点
         * @param targetY y目标位置
         * @param targetX x偏移量
         * @param rotation 落地角度
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 回调函数
         */
        export function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func): void {
            // 第一阶段
            Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), 0);
            }), delayed);
        }

        /**
         * 上升
         * @param node 节点
         * @param initialY 初始y位置
         * @param initialR 初始角度
         * @param targetY 目标y位置
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 回调函数
         */
        export function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func): void {
            node.y = initialY;
            node.rotation = initialR;
            Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed);
        }

        /**
         * 用于卡牌X轴方向的横向旋转
         * 两个面不一样的卡牌旋转动画，卡牌正面有内容，卡牌背面没有内容，这个内容是一个子节点
         * @param node 节点
         * @param arr 子节点名称数组
         * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
         * @param time 每次旋转1/2次花费时间
         * @param delayed 延时时间
         * @param func2 结束时回调函数
         */
        export function cardRotateX_TowFace(node: Laya.Sprite, arr: string[], func1: Function, time: number, delayed: number, func2: Function): void {
            Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                // 所有子节点消失
                if (arr) {
                    for (let i = 0; i < arr.length; i++) {
                        let child = node.getChildByName(arr[i]);
                        if (child !== null) {
                            child['alpha'] = 0;
                        }
                    }
                }

                if (func1 !== null) {
                    func1();
                }
                Laya.Tween.to(node, { scaleX: 1 }, time * 0.9, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 0 }, time * 0.8, null, Laya.Handler.create(this, function () {
                        if (arr) {
                            for (let i = 0; i < arr.length; i++) {
                                let child = node.getChildByName(arr[i]);
                                if (child !== null) {
                                    child['alpha'] = 1;
                                }
                            }
                        }

                        Laya.Tween.to(node, { scaleX: 1 }, time * 0.7, null, Laya.Handler.create(this, function () {
                            if (func2 !== null) {
                                func2();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
        * 用于卡牌X轴方向的横向旋转
        * 两个面一样的卡牌旋转动画，正反面内容是一样的
        * @param node 节点
        * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
        * @param time 每次旋转1/2次花费时间
        * @param delayed 延时时间
        * @param func2 结束时回调函数
        */
        export function cardRotateX_OneFace(node: Laya.Sprite, func1: Function, time: number, delayed: number, func2: Function): void {
            Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                if (func1 !== null) {
                    func1();
                }
                Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func2 !== null) {
                        func2();
                    }
                }), 0);
            }), delayed);
        }

        /**
        * 用于卡牌Y轴方向的纵向旋转
        * 两个面不一样的卡牌旋转动画，卡牌正面有内容，卡牌背面没有内容，这个内容是一个子节点
        * @param node 节点
        * @param arr 子节点名称数组
        * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
        * @param time 每次旋转1/2次花费时间
        * @param delayed 延时时间
        * @param func2 结束时回调函数
        */
        export function cardRotateY_TowFace(node: Laya.Sprite, arr: string[], func1: Function, time: number, delayed: number, func2: Function): void {
            Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                // 所有子节点消失
                if (arr) {
                    for (let i = 0; i < arr.length; i++) {
                        let child = node.getChildByName(arr[i]);
                        if (child !== null) {
                            child['alpha'] = 0;
                        }
                    }
                }

                if (func1 !== null) {
                    func1();
                }
                Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 1 }, time * 1 / 2, null, Laya.Handler.create(this, function () {
                            if (arr) {

                                for (let i = 0; i < arr.length; i++) {
                                    let child = node.getChildByName(arr[i]);
                                    if (child !== null) {
                                        child['alpha'] = 1;
                                    }
                                }
                            }


                            if (func2 !== null) {
                                func2();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
        * 用于卡牌Y轴方向的纵向旋转
        * 两个面一样的卡牌旋转动画，正反面内容是一样的
        * @param node 节点
        * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
        * @param time 每次旋转1/2次花费时间
        * @param delayed 延时时间
        * @param func2 结束时回调函数
        */
        export function cardRotateY_OneFace(node: Laya.Sprite, func1: Function, time: number, delayed: number, func2: Function): void {
            Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                if (func1 !== null) {
                    func1();
                }
                Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func2 !== null) {
                        func2();
                    }
                }), 0);
            }), delayed);
        }

        /**
         * 移动中变化一次角度属性，分为两个阶段，第一个阶段是移动并且变化角度，第二个阶段是到达目标位置，并且角度回归为0
         * @param node 节点
         * @param targetX 目标x位置
         * @param targetY 目标y位置
         * @param per 中间位置的百分比
         * @param rotation_per 第一阶段变化到多少角度
         * @param time 花费时间
         * @param func
         */
        export function move_changeRotate(node, targetX, targetY, per, rotation_pe, time, func): void {

            let targetPerX = targetX * per + node.x * (1 - per);
            let targetPerY = targetY * per + node.y * (1 - per);

            Laya.Tween.to(node, { x: targetPerX, y: targetPerY, rotation: 45 }, time, null, Laya.Handler.create(this, function () {

                Laya.Tween.to(node, { x: targetX, y: targetY, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), 0);
        }

        /**
         * 类似气球弹出并且回弹，第一个阶段弹到空中，这个阶段可以给个角度，第二阶段落下变为原始状态，第三阶段再次放大一次，这次放大小一点，第四阶段回到原始状态，三、四个阶段是回弹一次，根据第一个阶段参数进行调整
         * @param node 节点
         * @param firstAlpha 初始透明度
         * @param  firstScale 最终大小，因为有些节点可能初始Scale并不是1
         * @param scale1 第一阶段放大比例
         * @param rotation 第一阶段角度 
         * @param time1 第一阶段花费时间
         * @param time2 第二阶段花费时间
         * @param delayed 延时时间
         * @param audioType 音效类型
         * @param func 完成后的回调
         */
        export function bombs_Appear(node, firstAlpha, firstScale, scale1, rotation, time1, time2, delayed, audioType, func): void {
            node.scale(0, 0);
            node.alpha = firstAlpha;
            Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, rotation: rotation }, time1, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                switch (audioType) {
                    case 'balloon':
                        // PalyAudio.playSound(Enum.AudioName.commonPopup, 1);
                        break;
                    case 'common':
                        // PalyAudio.playSound(Enum.AudioName.commonPopup, 1);
                        break;
                    default:
                        break;
                }
                Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.2, scaleY: firstScale + (scale1 - firstScale) * 0.2, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {

                        Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func()
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
         * 类似气球收缩消失
         * @param node 节点
         * @param scale 收缩后的大小
         * @param alpha 收缩后的透明度
         * @param rotation 收缩后的角度 
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         */
        export function bombs_Vanish(node, scale, alpha, rotation, time, delayed, func): void {

            Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                // PalyAudio.playSound(Enum.AudioName.commonVanish, 1);
                if (func !== null) {
                    func()
                }
            }), delayed);
        }

        /**
         * 类似于心脏跳动的回弹效果
         * @param node 节点
         * @param firstScale 初始大小,也就是原始大小
         * @param scale1 需要放大的大小,
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         */
        export function swell_shrink(node, firstScale, scale1, time, delayed, func): void {
            // PalyAudio.playSound(Enum.AudioName.commonPopup, 1);
            Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {

                Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {

                    Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.5, scaleY: firstScale + (scale1 - firstScale) * 0.5, rotation: 0 }, time * 0.5, null, Laya.Handler.create(this, function () {

                        Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func()
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
         * 简单移动,初始位置可以为null
         * @param node 节点
         * @param firstX 初始x位置
         * @param firstY 初始y位置
         * @param targetX 目标x位置
         * @param targetY 目标y位置
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         */
        export function move_Simple(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func()
                }
            }), delayed);
        }

        /**
         * expoIn简单移动,初始位置可以为null
         * @param node 节点
         * @param firstX 初始x位置
         * @param firstY 初始y位置
         * @param targetX 目标x位置
         * @param targetY 目标y位置
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         */
        export function move_Simple_01(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { x: targetX, y: targetY }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func()
                }
            }), delayed);
        }

        /**
        * X轴方向的移动伴随形变回弹效果，移动的过程中X轴会被挤压，然后回到原始状态
        * @param node 节点
        * @param firstX 初始x位置
        * @param firstR 初始角度
        * @param scaleX x轴方向的挤压增量
        * @param scaleY y轴方向的挤压增量
        * @param targetX 目标X位置
        * @param time 花费时间
        * @param delayed 延时时间
        * @param func 完成后的回调
        */
        export function move_Deform_X(node, firstX, firstR, targetX, scaleX, scaleY, time, delayed, func): void {
            node.alpha = 0;
            node.x = firstX;
            node.rotation = firstR;
            Laya.Tween.to(node, { x: targetX, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(node, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), delayed);
        }


        /**
        * Y轴方向的移动伴随形变回弹效果，移动的过程中X轴会被挤压，然后回到原始状态
        * @param target 节点
        * @param firstY 初始Y位置
        * @param firstR 初始角度
        * @param scaleY y轴方向的挤压
        * @param scaleX x轴方向的挤压
        * @param targeY 目标Y位置
        * @param time 花费时间
        * @param delayed 延时时间
        * @param func 完成后的回调
        */
        export function move_Deform_Y(target, firstY, firstR, targeY, scaleX, scaleY, time, delayed, func): void {
            target.alpha = 0;
            if (firstY) {
                target.y = firstY;
            }
            target.rotation = firstR;
            Laya.Tween.to(target, { y: targeY, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(target, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), delayed);
        }

        /**
        * 简单的透明度渐变闪烁动画
        * @param target 节点
        * @param minAlpha 最低到多少透明度
        * @param maXalpha 最高透明度
        * @param time 花费时间
        * @param delayed 延迟时间
        * @param func 完成后的回调
        */
        export function blink_FadeOut(target, minAlpha, maXalpha, time, delayed, func): void {
            target.alpha = minAlpha;
            Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), delayed);
        }

        /**
         * 提示框动画1,从渐隐出现+上移=》停留=》到渐隐消失+向下
         * @param target 节点
         * @param upNum 向上上升高度
         * @param time1 向上上升的时间
         * @param stopTime 停留时间
         * @param downNum 向下消失距离
         * @param time2 向下消失时间
         * @param func 结束回调
         */
        export function HintAni_01(target, upNum, time1, stopTime, downNum, time2, func): void {
            target.alpha = 0;
            Laya.Tween.to(target, { alpha: 1, y: target.y - upNum }, time1, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(target, { y: target.y - 15 }, stopTime, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: 0, y: target.y + upNum + downNum }, time2, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func()
                        }

                    }), 0);
                }), 0);
            }), 0);
        }


        /**
        * 放大缩小加上渐变
        * @param target 节点
        * @param fAlpha 初始透明度
        * @param fScaleX 初始X大小
        * @param fScaleY 初始Y大小
        * @param endScaleX 最终X大小
        * @param endScaleY 最终Y大小
        * @param eAlpha 最终透明度
        * @param time 花费时间
        * @param delayed 延迟时间
        * @param func 结束回调
        */
        export function scale_Alpha(target, fAlpha, fScaleX, fScaleY, eScaleX, eScaleY, eAlpha, time, delayed, func): void {
            target.alpha = fAlpha;
            target.scaleX = fScaleX;
            target.scaleY = fScaleY;
            Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY, alpha: eAlpha }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func()
                }
            }), delayed);
        }

        /**
         * 旋转放大回弹动画，旋转放大角度增加=》原始大小和角度=，旋转放大角度增加=》原始大小和角度，有一个回来效果
         * @param target 目标
         * @param eAngle 延伸角度，就是回收前的多出的角度
         * @param eScale 延伸大小，就是回收前的放大的大小
         * @param time1 第一阶段花费时间
         * @param time2 第二阶段花费时间
         * @param delayed1 第一阶段延时时间
         * @param delayed2 第一阶段延时时间
         * @param func 结束回调函数
         * */
        export function rotate_Magnify_KickBack(node, eAngle, eScale, time1, time2, delayed1, delayed2, func): void {
            node.alpha = 0;
            node.scaleX = 0;
            node.scaleY = 0;
            Laya.Tween.to(node, { alpha: 1, rotation: 360 + eAngle, scaleX: 1 + eScale, scaleY: 1 + eScale }, time1, null, Laya.Handler.create(this, function () {

                Laya.Tween.to(node, { rotation: 360 - eAngle / 2, scaleX: 1 + eScale / 2, scaleY: 1 + eScale / 2 }, time2, null, Laya.Handler.create(this, function () {

                    Laya.Tween.to(node, { rotation: 360 + eAngle / 3, scaleX: 1 + eScale / 5, scaleY: 1 + eScale / 5 }, time2, null, Laya.Handler.create(this, function () {

                        Laya.Tween.to(node, { rotation: 360, scaleX: 1, scaleY: 1 }, time2, null, Laya.Handler.create(this, function () {
                            node.rotation = 0;
                            if (func !== null) {
                                func()
                            }
                        }), 0);
                    }), delayed2);
                }), 0);
            }), delayed1);
        }
    }
    /**
     * number.这里导出的是模块不是类，没有this，所以此模块的回调函数要写成func=>{}这种箭头函数，箭头函数会把{}里面的this指向原来的this。
     * 2.音乐播放模块
     */
    export module PalyAudio {

        // /**单张发牌音效
        //  * @param number 播放次数
        // */
        // export function aAingleCard(number): void {
        //     Laya.SoundManager.playSound('音效/单张发牌.mp3', number, Laya.Handler.create(this, function () { }));
        // }

        // /**连续发牌音效
        //  * @param number 播放次数
        // */
        // export function groupUp(number): void {
        //     Laya.SoundManager.playSound('音效/连续发牌.mp3', number, Laya.Handler.create(this, function () { }));
        // }
        // /**群体下落音效
        //  * @param number 播放次数 
        // */
        // export function groupDrop(number): void {
        //     Laya.SoundManager.playSound('音效/全体下落.mp3', number, Laya.Handler.create(this, function () { }));
        // }

        // /**播放单张卡牌旋转音效
        //  * @param number 播放次数
        // */
        // export function cardRotate(number): void {
        //     Laya.SoundManager.playSound('音效/单张牌旋转.mp3', number, Laya.Handler.create(this, function () { }));
        // }

        // /**游戏结束音效
        //  * @param number 播放次数
        // */
        // export function gameOver(number): void {
        //     Laya.SoundManager.playSound('音效/结束.mp3', number, Laya.Handler.create(this, function () { }));
        // }

        // /**点击正确音效
        // * @param number 播放次数
        // */
        // export function clickRight(number): void {
        //     Laya.SoundManager.playSound('音效/点击正确.mp3', number, Laya.Handler.create(this, function () { }));
        // }

        // /**点击正确音效
        //  * @param number 播放次数
        // */
        // export function clickError(number): void {
        //     Laya.SoundManager.playSound('音效/点击错误.mp3', number, Laya.Handler.create(this, function () { }));
        // }

        /**通用音效播放
         * @param url 音效地址
         * @param number 播放次数
         */
        export function playSound(url, number) {
            Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () { }));
        }

        /**通用背景音乐播放
        * @param url 音效地址
        * @param number 循环次数，0表示无限循环
        * @param deley 延时时间
        */
        export function playMusic(url, number, deley) {
            Laya.SoundManager.playMusic(url, number, Laya.Handler.create(this, function () { }), deley);
        }

        /**停止播放背景音乐*/
        export function stopMusic() {
            Laya.SoundManager.stopMusic();
        }
    }

    /**工具模块*/
    export module Tools {
        /**
         * 为一个节点创建一个扇形遮罩发
         * 想要遮罩的形状发生变化，必须先将父节点的cacheAs改回“none”，接着改变其角度，再次将cacheAs改为“bitmap”，必须在同一帧内进行，因为是同一帧，所以在当前帧最后或者下一帧前表现出来，帧内时间不会表现任何状态，这是个思路，帧内做任何变化都不会显示，只要帧结尾改回来就行。
         * @param parent 被遮罩的节点，也是父节点
         * @param startAngle 扇形的初始角度
         * @param endAngle 扇形结束角度
        */
        export function drawPieMask(parent, startAngle, endAngle): Laya.DrawPieCmd {
            // 父节点cacheAs模式必须为"bitmap"
            parent.cacheAs = "bitmap";
            //新建一个sprite作为绘制扇形节点
            let drawPieSpt = new Laya.Sprite();
            //设置叠加模式
            drawPieSpt.blendMode = "destination-out";
            // 加入父节点
            parent.addChild(drawPieSpt);
            // 绘制扇形，位置在中心位置，大小略大于父节点，保证完全遮住
            let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
            return drawPie;
        }

        /**
         * 将3D物体坐标转换程屏幕坐标
         * @param v3 3D世界的坐标
         * @param camera 摄像机
        */
        export function transitionScreenPointfor3D(v3: Laya.Vector3, camera: Laya.Camera): Laya.Vector2 {
            let ScreenV3 = new Laya.Vector3();
            camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV3);
            let point: Laya.Vector2 = new Laya.Vector2();
            point.x = ScreenV3.x;
            point.y = ScreenV3.y;
            return point;
        }
        /**
         * 
         * @param n 
         * @param m 第二个随机数不存在的话默认为10
         */
        export function random(n: number, m?: number) {
            m = m || 10;
            const c: number = m - n + 1;
            return Math.floor(Math.random() * c + n)
        }
        /**
         * 
         * @param arr 
         * @param count
         * 从数组中随机取出count个数 
         */
        export function getRandomArrayElements(arr, count) {
            var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
            while (i-- > min) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled.slice(min);
        }
        export function getArrayDifElements(arr, count): any {
            const result = [];
            let i: number = 0;
            for (i; i < count; i++) {
                const temp = getDiffEle(arr.slice(), result, i);
                result.push(temp);
            }
            return result;
        }
        export function getDiffEle(arr, result, place) {
            let indexArr = [];
            let i: number = 0;
            for (i; i < arr.length - place; i++) {
                indexArr.push(i);
            }
            const ranIndex = Math.floor(Math.random() * indexArr.length);
            if (result.indexOf(arr[ranIndex]) === -1) {
                const backNum = arr[ranIndex];
                arr[ranIndex] = arr[indexArr.length - 1];
                return backNum;
            } else {
                arr.splice(ranIndex, 1);
                return getDiffEle(arr, result, place);
            }
        }
        export let roleDragCan: boolean = false;
        export function copydata(obj): any {
            const ret = {};
            Object.getOwnPropertyNames(obj).forEach(name => {
                ret[name] = obj[name];
            });
            return ret;
        }

        /**
         * 数组复制 
         */
        export function fillArray(value, len) {
            var arr = [];
            for (var i = 0; i < len; i++) {
                arr.push(value);
            }
            return arr;
        }

        /**
         * 根据不同的角度，
         * @param angle 角度
         * @param XY 必须包含y上的速度
         */
        export function speedByAngle(angle: number, XY: any) {
            if (angle % 90 === 0 || !angle) {
                console.error("计算的角度异常,需要查看：", angle);
                // debugger
                return;
            }
            let speedXY = { x: 0, y: 0 };
            speedXY.y = XY.y;
            speedXY.x = speedXY.y / Math.tan(angle * Math.PI / 180);
            return speedXY;
        }

        /**
         * 根据不同的角度和速度计算坐标
         * */
        export function speedXYByAngle(angle: number, speed: number) {
            if (angle % 90 === 0 || !angle) {
                //debugger
            }
            const speedXY = { x: 0, y: 0 };
            speedXY.x = speed * Math.cos(angle * Math.PI / 180);
            speedXY.y = speed * Math.sin(angle * Math.PI / 180);
            return speedXY;
        }

        export function speedLabelByAngle(angle: number, speed: number, speedBate?: number) {
            // if (angle % 90 === 0 || !angle) {
            //     debugger
            // }
            const speedXY = { x: 0, y: 0 };
            const selfAngle = angle;
            const defaultSpeed = speed;
            const bate = speedBate || 1;
            if (selfAngle % 90 === 0) {
                if (selfAngle === 0 || selfAngle === 360) {
                    speedXY.x = Math.abs(defaultSpeed) * bate;
                } else if (selfAngle === 90) {
                    speedXY.y = Math.abs(defaultSpeed) * bate;
                } else if (selfAngle === 180) {
                    speedXY.x = -Math.abs(defaultSpeed) * bate;
                } else {
                    speedXY.y = -Math.abs(defaultSpeed) * bate;
                }
            } else {
                const tempXY = Tools.speedXYByAngle(selfAngle, defaultSpeed);
                speedXY.x = tempXY.x;
                speedXY.y = tempXY.y;
                if (selfAngle > 0 && selfAngle < 180) {
                    speedXY.y = Math.abs(speedXY.y) * bate;
                } else {
                    speedXY.y = -Math.abs(speedXY.y) * bate;
                }
                if (selfAngle > 90 && selfAngle < 270) {
                    speedXY.x = -Math.abs(speedXY.x) * bate;
                } else {
                    speedXY.x = Math.abs(speedXY.x) * bate;
                }
            }
            return speedXY;
        }
        /**
         * 
         * @param degree 角度
         * 根据角度计算弧度
         */
        export function getRad(degree) {
            return degree / 180 * Math.PI;
        }
        /**
         * 求圆上的点的坐标~
         */
        export function getRoundPos(angle: number, radius: number, centPos: any) {
            var center = centPos; //圆心坐标
            var radius = radius; //半径
            var hudu = (2 * Math.PI / 360) * angle; //90度角的弧度

            var X = center.x + Math.sin(hudu) * radius; //求出90度角的x坐标
            var Y = center.y - Math.cos(hudu) * radius; //求出90度角的y坐标
            return { x: X, y: Y };
        }
        /**
         * 转化大的数字
         */
        export function converteNum(num: number): string {
            if (typeof (num) !== "number") {
                console.warn("要转化的数字并不为number");
                return num;
            }
            let backNum: string;

            if (num < 1000) {
                backNum = "" + num;
            } else if (num < 1000000) {
                backNum = "" + (num / 1000).toFixed(1) + "k";
            } else if (num < 10e8) {
                backNum = "" + (num / 1000000).toFixed(1) + "m";
            } else {
                backNum = "" + num;
            }
            return backNum;
        }
    }
}
export default lwg;
