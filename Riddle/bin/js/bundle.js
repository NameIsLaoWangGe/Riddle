(function () {
    'use strict';

    var lwg;
    (function (lwg) {
        let Global;
        (function (Global) {
            Global._gameLevel = 1;
            Global._gameStart = false;
            Global._execution = 15;
            Global._CustomsNum = 999;
            Global._stageClick = true;
            Global._timeLineSwitch = false;
            Global._gameTimeLine = 0;
            Global._goldNum = 0;
            Global._voiceSwitch = true;
            Global._shakeSwitch = true;
            Global._allPifu = ['01_xiaofu', '02_konglong', '03_xueren', '04_qipao', '05_qianxun', '06_lvyifu', '07_maozi', '08_lufei', '09_chaoren'];
            Global.pingceV = true;
            function _vibratingScreen() {
            }
            Global._vibratingScreen = _vibratingScreen;
            function _createLevel(parent, x, y) {
                let sp;
                Laya.loader.load('prefab/LevelNode.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 0;
                    let level = sp.getChildByName('level');
                    level.text = 'NO.' + lwg.Global._gameLevel;
                    Global.LevelNode = sp;
                }));
            }
            Global._createLevel = _createLevel;
            function _createKeyNum(parent, x, y) {
                let sp;
                Laya.loader.load('prefab/KeyNum.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 0;
                    let num = sp.getChildByName('Num');
                    num.text = lwg.Global._execution + '/' + '5';
                    Global.KeyNumNode = sp;
                }));
            }
            Global._createKeyNum = _createKeyNum;
            function _createBtnSet(parent) {
                let sp;
                Laya.loader.load('prefab/BtnSet.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(671, 273);
                    sp.zOrder = 0;
                    Click.on(Enum.ClickType.largen, null, sp, null, null, null, btnSetUp, null);
                    Global.BtnSetNode = sp;
                }));
            }
            Global._createBtnSet = _createBtnSet;
            function btnSetUp() {
                Admin._openScene('UISet', null, null, null);
            }
            Global.btnSetUp = btnSetUp;
            function _createGoldNum(parent) {
                let sp;
                Laya.loader.load('prefab/GoldNum.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    let num = sp.getChildByName('Num');
                    num.value = Global._goldNum.toString();
                    parent.addChild(sp);
                    sp.pos(114, 91);
                    sp.zOrder = 0;
                    Global.GoldNumNode = sp;
                }));
            }
            Global._createGoldNum = _createGoldNum;
            function _createExecutionNum(parent) {
                let sp;
                Laya.loader.load('prefab/ExecutionNum.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    let num = sp.getChildByName('Num');
                    num.value = Global._execution.toString();
                    sp.pos(297, 91);
                    sp.zOrder = 0;
                    Global.ExecutionNumNode = sp;
                }));
            }
            Global._createExecutionNum = _createExecutionNum;
            function _createBtnPause(parent) {
                let sp;
                Laya.loader.load('prefab/BtnPause.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(645, 137);
                    sp.zOrder = 0;
                    Global.BtnPauseNode = sp;
                    Click.on(Enum.ClickType.largen, null, sp, null, null, null, btnPauseUp, null);
                }));
            }
            Global._createBtnPause = _createBtnPause;
            function btnPauseUp(event) {
                event.currentTarget.scale(1, 1);
                lwg.Admin._openScene('UIPause', null, null, null);
            }
            Global.btnPauseUp = btnPauseUp;
            function _createBtnHint(parent) {
                let sp;
                Laya.loader.load('prefab/BtnHint.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(645, 273);
                    sp.zOrder = 0;
                    Global.BtnHintNode = sp;
                    Click.on(Enum.ClickType.largen, null, sp, null, null, null, btnHintUp, null);
                }));
            }
            Global._createBtnHint = _createBtnHint;
            function btnHintUp(event) {
                event.currentTarget.scale(1, 1);
                lwg.Global._createHint(lwg.Enum.HintType.noHint);
            }
            Global.btnHintUp = btnHintUp;
            function _createBtnAgain(parent) {
                let sp;
                Laya.loader.load('prefab/BtnAgain.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(645, 404);
                    sp.zOrder = 0;
                    Click.on(Enum.ClickType.largen, null, sp, null, null, null, btnAgainUp, null);
                    Global.BtnAgainNode = sp;
                }));
            }
            Global._createBtnAgain = _createBtnAgain;
            function btnAgainUp(event) {
                event.currentTarget.scale(1, 1);
                Admin._refreshScene();
            }
            Global.btnAgainUp = btnAgainUp;
            function _createHint(type) {
                let sp;
                Laya.loader.load('prefab/HintPre.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
                    let dec = sp.getChildByName('dec');
                    dec.text = Enum.HintDec[type];
                    Animation.HintAni_01(sp, 100, 100, 1000, 50, 100, f => {
                        sp.removeSelf();
                    });
                }));
            }
            Global._createHint = _createHint;
            function _createGold(type, parent, x, y) {
                let sp;
                Laya.loader.load('prefab/GolPre.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(x, y);
                }));
            }
            Global._createGold = _createGold;
        })(Global = lwg.Global || (lwg.Global = {}));
        let LocalStorage;
        (function (LocalStorage) {
            let storageData;
            function addData() {
                storageData = {
                    '_gameLevel': lwg.Global._gameLevel,
                    '_goldNum': lwg.Global._goldNum,
                    '_execution': lwg.Global._execution,
                };
                let data = JSON.stringify(storageData);
                Laya.LocalStorage.setItem('storageData', data);
            }
            LocalStorage.addData = addData;
            function clearData() {
                Laya.LocalStorage.clear();
            }
            LocalStorage.clearData = clearData;
            function getData() {
                let storageData = Laya.LocalStorage.getJSON('storageData');
                if (storageData) {
                    return storageData;
                }
                else {
                    lwg.Global._gameLevel = 1;
                    lwg.Global._goldNum = 0;
                    lwg.Global._execution = 15;
                    return null;
                }
            }
            LocalStorage.getData = getData;
        })(LocalStorage = lwg.LocalStorage || (lwg.LocalStorage = {}));
        let Admin;
        (function (Admin) {
            Admin._sceneControl = {};
            function _openScene(openName, zOder, cloesScene, func) {
                Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene) {
                    scene.width = Laya.stage.width;
                    scene.height = Laya.stage.height;
                    Laya.stage.addChild(scene);
                    let background = scene.getChildByName('background');
                    if (background) {
                        background.width = Laya.stage.width;
                        background.height = Laya.stage.height;
                    }
                    console.log('打开' + openName + '场景');
                    if (cloesScene) {
                        cloesScene.close();
                    }
                    if (func) {
                        func();
                    }
                    Admin._sceneControl[openName] = scene;
                }));
            }
            Admin._openScene = _openScene;
            function _openCustomsScene() {
                let sceneName;
                let num;
                if (lwg.Global._gameLevel >= 30) {
                    num = lwg.Global._gameLevel - 29;
                }
                else {
                    num = lwg.Global._gameLevel;
                }
                Admin.openLevelNum = num;
                if (num <= 9) {
                    sceneName = 'UIMain_00' + num;
                }
                else if (9 < num || num <= 99) {
                    sceneName = 'UIMain_0' + num;
                }
                if (num <= 9) {
                    sceneName = 'UIMain_00' + num;
                }
                else if (9 < num || num <= 99) {
                    sceneName = 'UIMain_0' + num;
                }
                Admin.openCustomName = sceneName;
                _openScene(sceneName, null, null, f => {
                    lwg.Global._gameStart = true;
                });
            }
            Admin._openCustomsScene = _openCustomsScene;
            function _openNumCustomsScene() {
                let sceneName;
                if (Admin.openLevelNum <= 9) {
                    sceneName = 'UIMain_00' + Admin.openLevelNum;
                }
                else if (9 < Admin.openLevelNum || Admin.openLevelNum <= 99) {
                    sceneName = 'UIMain_0' + Admin.openLevelNum;
                }
                if (Admin.openLevelNum <= 9) {
                    sceneName = 'UIMain_00' + Admin.openLevelNum;
                }
                else if (9 < Admin.openLevelNum || Admin.openLevelNum <= 99) {
                    sceneName = 'UIMain_0' + Admin.openLevelNum;
                }
                Admin.openCustomName = sceneName;
                _openScene(sceneName, null, null, f => {
                    lwg.Global._gameStart = true;
                });
            }
            Admin._openNumCustomsScene = _openNumCustomsScene;
            function _refreshScene() {
                Admin._sceneControl[Admin.openCustomName].close();
                _openScene(Admin.openCustomName, null, null, null);
            }
            Admin._refreshScene = _refreshScene;
            function _closeScene() {
                Admin._sceneControl[Admin.openCustomName].close();
            }
            Admin._closeScene = _closeScene;
            class Scene extends Laya.Script {
                constructor() {
                    super();
                }
                onEnable() {
                    this.self = this.owner;
                    this.lwgInit();
                    let calssName = this['__proto__']['constructor'].name;
                    this.self[calssName] = this;
                    this.btnOnClick();
                    this.adaptive();
                }
                lwgInit() {
                    console.log('父类的初始化！');
                }
                btnOnClick() {
                }
                adaptive() {
                }
                openAni() {
                }
                vanishAni() {
                }
            }
            Admin.Scene = Scene;
            class Person extends Laya.Script {
                constructor() {
                    super();
                }
                onEnable() {
                    this.self = this.owner;
                    this.selfScene = this.self.scene;
                    this.rig = this.self.getComponent(Laya.RigidBody);
                    let calssName = this['__proto__']['constructor'].name;
                    this.self[calssName] = this;
                    this.lwgInit();
                }
                lwgInit() {
                    console.log('父类的初始化！');
                }
            }
            Admin.Person = Person;
            class Object extends Laya.Script {
                constructor() {
                    super();
                }
                onEnable() {
                    this.self = this.owner;
                    this.selfScene = this.self.scene;
                    let calssName = this['__proto__']['constructor'].name;
                    this.self[calssName] = this;
                    this.rig = this.self.getComponent(Laya.RigidBody);
                    this.lwgInit();
                }
                lwgInit() {
                    console.log('父类的初始化！');
                }
            }
            Admin.Object = Object;
        })(Admin = lwg.Admin || (lwg.Admin = {}));
        let Effects;
        (function (Effects) {
            let SkinUrl;
            (function (SkinUrl) {
                SkinUrl[SkinUrl["Effects/cir_white.png"] = 0] = "Effects/cir_white.png";
                SkinUrl[SkinUrl["Effects/cir_black.png"] = 1] = "Effects/cir_black.png";
                SkinUrl[SkinUrl["Effects/cir_blue.png"] = 2] = "Effects/cir_blue.png";
                SkinUrl[SkinUrl["Effects/cir_bluish.png"] = 3] = "Effects/cir_bluish.png";
                SkinUrl[SkinUrl["Effects/cir_cyan.png"] = 4] = "Effects/cir_cyan.png";
                SkinUrl[SkinUrl["Effects/cir_grass.png"] = 5] = "Effects/cir_grass.png";
                SkinUrl[SkinUrl["Effects/cir_green.png"] = 6] = "Effects/cir_green.png";
                SkinUrl[SkinUrl["Effects/cir_orange.png"] = 7] = "Effects/cir_orange.png";
                SkinUrl[SkinUrl["Effects/cir_pink.png"] = 8] = "Effects/cir_pink.png";
                SkinUrl[SkinUrl["Effects/cir_purple.png"] = 9] = "Effects/cir_purple.png";
                SkinUrl[SkinUrl["Effects/cir_red.png"] = 10] = "Effects/cir_red.png";
                SkinUrl[SkinUrl["Effects/cir_yellow.png"] = 11] = "Effects/cir_yellow.png";
                SkinUrl[SkinUrl["Effects/star_black.png"] = 12] = "Effects/star_black.png";
                SkinUrl[SkinUrl["Effects/star_blue.png"] = 13] = "Effects/star_blue.png";
                SkinUrl[SkinUrl["Effects/star_bluish.png"] = 14] = "Effects/star_bluish.png";
                SkinUrl[SkinUrl["Effects/star_cyan.png"] = 15] = "Effects/star_cyan.png";
                SkinUrl[SkinUrl["Effects/star_grass.png"] = 16] = "Effects/star_grass.png";
                SkinUrl[SkinUrl["Effects/star_green.png"] = 17] = "Effects/star_green.png";
                SkinUrl[SkinUrl["Effects/star_orange.png"] = 18] = "Effects/star_orange.png";
                SkinUrl[SkinUrl["Effects/star_pink.png"] = 19] = "Effects/star_pink.png";
                SkinUrl[SkinUrl["Effects/star_purple.png"] = 20] = "Effects/star_purple.png";
                SkinUrl[SkinUrl["Effects/star_red.png"] = 21] = "Effects/star_red.png";
                SkinUrl[SkinUrl["Effects/star_white.png"] = 22] = "Effects/star_white.png";
                SkinUrl[SkinUrl["Effects/star_yellow.png"] = 23] = "Effects/star_yellow.png";
            })(SkinUrl = Effects.SkinUrl || (Effects.SkinUrl = {}));
            class EffectsBase extends Laya.Script {
                onEnable() {
                    this.self = this.owner;
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
                lwgInit() {
                }
                initProperty() {
                }
                propertyAssign() {
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
                commonSpeedXYByAngle(angle, speed) {
                    this.self.x += Tools.speedXYByAngle(angle, speed + this.accelerated).x;
                    this.self.y += Tools.speedXYByAngle(angle, speed + this.accelerated).y;
                }
                moveRules() {
                }
                onUpdate() {
                    this.moveRules();
                }
                onDisable() {
                    Laya.Pool.recover(this.self.name, this.self);
                }
            }
            Effects.EffectsBase = EffectsBase;
            function createCommonExplosion(parent, quantity, x, y) {
                for (let index = 0; index < quantity; index++) {
                    let ele = Laya.Pool.getItemByClass('ele', Laya.Image);
                    ele.name = 'ele';
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
            Effects.createCommonExplosion = createCommonExplosion;
            class commonExplosion extends lwg.Effects.EffectsBase {
                initProperty() {
                    this.startAngle = 360 * Math.random();
                    this.startSpeed = 5 * Math.random() + 8;
                    this.startScale = 0.4 + Math.random() * 0.6;
                    this.accelerated = 0.1;
                    this.vanishTime = 8 + Math.random() * 10;
                }
                moveRules() {
                    this.timer++;
                    if (this.timer >= this.vanishTime / 2) {
                        this.self.alpha -= 0.15;
                    }
                    if (this.timer >= this.vanishTime) {
                        this.self.removeSelf();
                    }
                    else {
                        this.commonSpeedXYByAngle(this.startAngle, this.startSpeed + this.accelerated);
                    }
                }
            }
            Effects.commonExplosion = commonExplosion;
        })(Effects = lwg.Effects || (lwg.Effects = {}));
        let Sk;
        (function (Sk) {
            Sk.gongzhuTem = new Laya.Templet();
            Sk.wangziTem = new Laya.Templet();
            Sk.gouTem = new Laya.Templet();
            Sk.qingdi_01Tem = new Laya.Templet();
            Sk.qingdi_02Tem = new Laya.Templet();
            Sk.houmaTem = new Laya.Templet();
            Sk.houziTem = new Laya.Templet();
            Sk.houseTem = new Laya.Templet();
            function skLoding() {
                createGongzhuTem();
                createWangziTem();
                createGouTem();
                createQingdi_01Tem();
                createQingdi_02Tem();
                createHoumaTem();
                createHouziTem();
                createHouseTem();
            }
            Sk.skLoding = skLoding;
            function createGongzhuTem() {
                Sk.gongzhuTem.on(Laya.Event.COMPLETE, this, null);
                Sk.gongzhuTem.on(Laya.Event.ERROR, this, onError);
                Sk.gongzhuTem.loadAni("SK/gongzhu.sk");
            }
            Sk.createGongzhuTem = createGongzhuTem;
            function createWangziTem() {
                Sk.wangziTem.on(Laya.Event.COMPLETE, this, null);
                Sk.wangziTem.on(Laya.Event.ERROR, this, onError);
                Sk.wangziTem.loadAni("SK/wangzi.sk");
            }
            Sk.createWangziTem = createWangziTem;
            function createGouTem() {
                Sk.gouTem.on(Laya.Event.COMPLETE, this, null);
                Sk.gouTem.on(Laya.Event.ERROR, this, onError);
                Sk.gouTem.loadAni("SK/gou.sk");
            }
            Sk.createGouTem = createGouTem;
            function createQingdi_01Tem() {
                Sk.qingdi_01Tem.on(Laya.Event.COMPLETE, this, null);
                Sk.qingdi_01Tem.on(Laya.Event.ERROR, this, onError);
                Sk.qingdi_01Tem.loadAni("SK/qingdi.sk");
            }
            Sk.createQingdi_01Tem = createQingdi_01Tem;
            function createQingdi_02Tem() {
                Sk.qingdi_02Tem.on(Laya.Event.COMPLETE, this, null);
                Sk.qingdi_02Tem.on(Laya.Event.ERROR, this, onError);
                Sk.qingdi_02Tem.loadAni("SK/qingdi1.sk");
            }
            Sk.createQingdi_02Tem = createQingdi_02Tem;
            function createHoumaTem() {
                Sk.houmaTem.on(Laya.Event.COMPLETE, this, null);
                Sk.houmaTem.on(Laya.Event.ERROR, this, onError);
                Sk.houmaTem.loadAni("SK/houma.sk");
            }
            Sk.createHoumaTem = createHoumaTem;
            function createHouziTem() {
                Sk.houziTem.on(Laya.Event.COMPLETE, this, null);
                Sk.houziTem.on(Laya.Event.ERROR, this, onError);
                Sk.houziTem.loadAni("SK/houzi.sk");
            }
            Sk.createHouziTem = createHouziTem;
            function createHouseTem() {
                Sk.houseTem.on(Laya.Event.COMPLETE, this, null);
                Sk.houseTem.on(Laya.Event.ERROR, this, onError);
                Sk.houseTem.loadAni("SK/house.sk");
            }
            Sk.createHouseTem = createHouseTem;
            function onError() {
                console.log('加载失败！');
            }
            Sk.onError = onError;
        })(Sk = lwg.Sk || (lwg.Sk = {}));
        let Enum;
        (function (Enum) {
            let HintDec;
            (function (HintDec) {
                HintDec[HintDec["\u91D1\u5E01\u4E0D\u591F\u4E86\uFF01"] = 0] = "\u91D1\u5E01\u4E0D\u591F\u4E86\uFF01";
                HintDec[HintDec["\u6CA1\u6709\u53EF\u4EE5\u5356\u7684\u76AE\u80A4\u4E86\uFF01"] = 1] = "\u6CA1\u6709\u53EF\u4EE5\u5356\u7684\u76AE\u80A4\u4E86\uFF01";
                HintDec[HintDec["\u6682\u65E0\u5E7F\u544A!"] = 2] = "\u6682\u65E0\u5E7F\u544A!";
                HintDec[HintDec["\u6682\u65E0\u76AE\u80A4!"] = 3] = "\u6682\u65E0\u76AE\u80A4!";
                HintDec[HintDec["\u6682\u65E0\u5206\u4EAB!"] = 4] = "\u6682\u65E0\u5206\u4EAB!";
                HintDec[HintDec["\u6682\u65E0\u63D0\u793A\u673A\u4F1A!"] = 5] = "\u6682\u65E0\u63D0\u793A\u673A\u4F1A!";
            })(HintDec = Enum.HintDec || (Enum.HintDec = {}));
            let HintType;
            (function (HintType) {
                HintType[HintType["noGold"] = 0] = "noGold";
                HintType[HintType["noGetPifu"] = 1] = "noGetPifu";
                HintType[HintType["noAdv"] = 2] = "noAdv";
                HintType[HintType["noPifu"] = 3] = "noPifu";
                HintType[HintType["noShare"] = 4] = "noShare";
                HintType[HintType["noHint"] = 5] = "noHint";
            })(HintType = Enum.HintType || (Enum.HintType = {}));
            let PifuOrder;
            (function (PifuOrder) {
                PifuOrder[PifuOrder["01_xiaofu"] = 0] = "01_xiaofu";
                PifuOrder[PifuOrder["02_konglong"] = 1] = "02_konglong";
                PifuOrder[PifuOrder["03_xueren"] = 2] = "03_xueren";
                PifuOrder[PifuOrder["04_qipao"] = 3] = "04_qipao";
                PifuOrder[PifuOrder["05_qianxun"] = 4] = "05_qianxun";
                PifuOrder[PifuOrder["06_lvyifu"] = 5] = "06_lvyifu";
                PifuOrder[PifuOrder["07_maozi"] = 6] = "07_maozi";
                PifuOrder[PifuOrder["08_lufei"] = 7] = "08_lufei";
                PifuOrder[PifuOrder["09_chaoren"] = 8] = "09_chaoren";
            })(PifuOrder = Enum.PifuOrder || (Enum.PifuOrder = {}));
            let ClickType;
            (function (ClickType) {
                ClickType["noEffect"] = "noEffect";
                ClickType["largen"] = "largen";
                ClickType["balloon"] = "balloon";
                ClickType["beetle"] = "beetle";
            })(ClickType = Enum.ClickType || (Enum.ClickType = {}));
            let voiceUrl;
            (function (voiceUrl) {
                voiceUrl["btn"] = "voice/btn.wav";
                voiceUrl["bgm"] = "voice/bgm.mp3";
                voiceUrl["victory"] = "voice/guoguan.wav";
                voiceUrl["defeated"] = "voice/wancheng.wav";
            })(voiceUrl = Enum.voiceUrl || (Enum.voiceUrl = {}));
            let PifuAllName;
            (function (PifuAllName) {
                PifuAllName[PifuAllName["01_xiaofu"] = 0] = "01_xiaofu";
                PifuAllName[PifuAllName["02_konglong"] = 1] = "02_konglong";
                PifuAllName[PifuAllName["03_xueren"] = 2] = "03_xueren";
                PifuAllName[PifuAllName["04_qipao"] = 3] = "04_qipao";
                PifuAllName[PifuAllName["05_qianxun"] = 4] = "05_qianxun";
                PifuAllName[PifuAllName["06_lvyifu"] = 5] = "06_lvyifu";
                PifuAllName[PifuAllName["07_maozi"] = 6] = "07_maozi";
                PifuAllName[PifuAllName["08_lufei"] = 7] = "08_lufei";
                PifuAllName[PifuAllName["09_chaoren"] = 8] = "09_chaoren";
            })(PifuAllName = Enum.PifuAllName || (Enum.PifuAllName = {}));
            let PifuAllName_Ch;
            (function (PifuAllName_Ch) {
                PifuAllName_Ch[PifuAllName_Ch["\u540C\u684C"] = 0] = "\u540C\u684C";
                PifuAllName_Ch[PifuAllName_Ch["\u5C0F\u6050\u9F99"] = 1] = "\u5C0F\u6050\u9F99";
                PifuAllName_Ch[PifuAllName_Ch["\u96EA\u4EBA"] = 2] = "\u96EA\u4EBA";
                PifuAllName_Ch[PifuAllName_Ch["\u557E\u557E"] = 3] = "\u557E\u557E";
                PifuAllName_Ch[PifuAllName_Ch["\u5C0F\u828A"] = 4] = "\u5C0F\u828A";
                PifuAllName_Ch[PifuAllName_Ch["\u9EA6\u5C14"] = 5] = "\u9EA6\u5C14";
                PifuAllName_Ch[PifuAllName_Ch["\u68D2\u7403\u5C0F\u5B50"] = 6] = "\u68D2\u7403\u5C0F\u5B50";
                PifuAllName_Ch[PifuAllName_Ch["\u9646\u80A5"] = 7] = "\u9646\u80A5";
                PifuAllName_Ch[PifuAllName_Ch["\u82F1\u96C4"] = 8] = "\u82F1\u96C4";
            })(PifuAllName_Ch = Enum.PifuAllName_Ch || (Enum.PifuAllName_Ch = {}));
            let PifuSkin;
            (function (PifuSkin) {
                PifuSkin[PifuSkin["pifu/pifu_01_xiaofu.png"] = 0] = "pifu/pifu_01_xiaofu.png";
                PifuSkin[PifuSkin["pifu/pifu_02_konglong.png"] = 1] = "pifu/pifu_02_konglong.png";
                PifuSkin[PifuSkin["pifu/pifu_03_xueren.png"] = 2] = "pifu/pifu_03_xueren.png";
                PifuSkin[PifuSkin["pifu/pifu_04_qipao.png"] = 3] = "pifu/pifu_04_qipao.png";
                PifuSkin[PifuSkin["pifu/pifu_05_qianxun.png"] = 4] = "pifu/pifu_05_qianxun.png";
                PifuSkin[PifuSkin["pifu/pifu_06_lvyifu.png"] = 5] = "pifu/pifu_06_lvyifu.png";
                PifuSkin[PifuSkin["pifu/pifu_07_maozi.png"] = 6] = "pifu/pifu_07_maozi.png";
                PifuSkin[PifuSkin["pifu/pifu_08_lufei.png"] = 7] = "pifu/pifu_08_lufei.png";
                PifuSkin[PifuSkin["pifu/pifu_09_chaoren.png"] = 8] = "pifu/pifu_09_chaoren.png";
            })(PifuSkin = Enum.PifuSkin || (Enum.PifuSkin = {}));
            let PifuSkin_No;
            (function (PifuSkin_No) {
                PifuSkin_No[PifuSkin_No["pifu/pifu_01_xiaofu_h.png"] = 0] = "pifu/pifu_01_xiaofu_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_02_konglong_h.png"] = 1] = "pifu/pifu_02_konglong_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_03_xueren_h.png"] = 2] = "pifu/pifu_03_xueren_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_04_qipao_h.png"] = 3] = "pifu/pifu_04_qipao_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_05_qianxun_h.png"] = 4] = "pifu/pifu_05_qianxun_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_06_lvyifu_h.png"] = 5] = "pifu/pifu_06_lvyifu_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_07_maozi_h.png"] = 6] = "pifu/pifu_07_maozi_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_08_lufei_h.png"] = 7] = "pifu/pifu_08_lufei_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_09_chaoren_h.png"] = 8] = "pifu/pifu_09_chaoren_h.png";
            })(PifuSkin_No = Enum.PifuSkin_No || (Enum.PifuSkin_No = {}));
            let TaskType;
            (function (TaskType) {
                TaskType["topUp"] = "topUp";
                TaskType["move"] = "move";
                TaskType["continue"] = "continue";
                TaskType["gold"] = "gold";
            })(TaskType = Enum.TaskType || (Enum.TaskType = {}));
            let SceneName;
            (function (SceneName) {
                SceneName["UILoding"] = "UILoding";
                SceneName["UIMain"] = "UIMain";
                SceneName["UIStart"] = "UIStart";
                SceneName["UITask"] = "UITask";
                SceneName["UIVictory"] = "UIVictory";
                SceneName["UIDefeated"] = "UIDefeated";
            })(SceneName = Enum.SceneName || (Enum.SceneName = {}));
            let PersonDir;
            (function (PersonDir) {
                PersonDir["up"] = "up";
                PersonDir["down"] = "down";
                PersonDir["left"] = "left";
                PersonDir["right"] = "right";
            })(PersonDir = Enum.PersonDir || (Enum.PersonDir = {}));
            let GameState;
            (function (GameState) {
                GameState["NoStart"] = "NoStart";
                GameState["Play"] = "Play";
                GameState["Pause"] = "pause";
                GameState["Victory"] = "victory";
                GameState["Defeated"] = "defeated";
            })(GameState = Enum.GameState || (Enum.GameState = {}));
            let MoveState;
            (function (MoveState) {
                MoveState["onFloor"] = "onFloor";
                MoveState["onLadder"] = "onLadder";
                MoveState["inAir"] = "inAir";
            })(MoveState = Enum.MoveState || (Enum.MoveState = {}));
            let BuffState;
            (function (BuffState) {
                BuffState["stick"] = "stick";
                BuffState["kettle"] = "kettle";
            })(BuffState = Enum.BuffState || (Enum.BuffState = {}));
            let RoomColor;
            (function (RoomColor) {
                RoomColor["blue"] = "blue";
                RoomColor["bluish"] = "bluish";
                RoomColor["grass"] = "grass";
                RoomColor["green"] = "green";
                RoomColor["pink"] = "pink";
                RoomColor["purple"] = "purple";
                RoomColor["red"] = "red";
                RoomColor["yellow"] = "yellow";
                RoomColor["yellowish"] = "yellowish";
            })(RoomColor = Enum.RoomColor || (Enum.RoomColor = {}));
            let RoomSkin;
            (function (RoomSkin) {
                RoomSkin["blue"] = "Room/room_blue.png";
                RoomSkin["bluish"] = "Room/room_bluish.png";
                RoomSkin["grass"] = "Room/room_grass.png";
                RoomSkin["green"] = "Room/room_green.png";
                RoomSkin["pink"] = "Room/room_pink.png";
                RoomSkin["purple"] = "Room/room_purple.png";
                RoomSkin["red"] = "Room/room_red.png";
                RoomSkin["yellow"] = "Room/room_yellow.png";
                RoomSkin["yellowish"] = "Room/room_yellowish.png";
            })(RoomSkin = Enum.RoomSkin || (Enum.RoomSkin = {}));
            let WallSkin;
            (function (WallSkin) {
                WallSkin["blue"] = "Room/room_blue_wall.png";
                WallSkin["bluish"] = "Room/room_bluish_wall.png";
                WallSkin["grass"] = "Room/room_grass_wall.png";
                WallSkin["green"] = "Room/room_green_wall.png";
                WallSkin["pink"] = "Room/room_pink_wall.png";
                WallSkin["purple"] = "Room/room_purple_wall.png";
                WallSkin["red"] = "Room/room_red_wall.png";
                WallSkin["yellow"] = "Room/room_yellow_wall.png";
                WallSkin["yellowish"] = "Room/room_yellowish_wall.png";
            })(WallSkin = Enum.WallSkin || (Enum.WallSkin = {}));
            let AisleColorSkin;
            (function (AisleColorSkin) {
                AisleColorSkin["blue"] = "Room/room_blue_color.png";
                AisleColorSkin["bluish"] = "Room/room_bluish_color.png";
                AisleColorSkin["grass"] = "Room/room_grass_color.png";
                AisleColorSkin["green"] = "Room/room_green_color.png";
                AisleColorSkin["pink"] = "Room/room_pink_color.png";
                AisleColorSkin["purple"] = "Room/room_purple_color.png";
                AisleColorSkin["red"] = "Room/room_red_color.png";
                AisleColorSkin["yellow"] = "Room/room_yellow_color.png";
                AisleColorSkin["yellowish"] = "Room/room_yellowish_color.png";
            })(AisleColorSkin = Enum.AisleColorSkin || (Enum.AisleColorSkin = {}));
            let gongzhuAni;
            (function (gongzhuAni) {
                gongzhuAni["walk"] = "walk";
                gongzhuAni["die"] = "die";
                gongzhuAni["die_xianglian"] = "die_xianglian";
                gongzhuAni["walk_gun"] = "walk_gun";
                gongzhuAni["walk_shuihu"] = "walk_shuihu";
                gongzhuAni["walk_xianglian"] = "walk_xianglian";
                gongzhuAni["attack_gun"] = "attack_gun";
                gongzhuAni["attack_shuihu"] = "attack_shuihu";
                gongzhuAni["win"] = "win";
                gongzhuAni["win_xianglian"] = "win_xianglian";
            })(gongzhuAni = Enum.gongzhuAni || (Enum.gongzhuAni = {}));
            let dogAni;
            (function (dogAni) {
                dogAni["standby"] = "standby";
                dogAni["walk"] = "walk";
                dogAni["die"] = "die";
            })(dogAni = Enum.dogAni || (Enum.dogAni = {}));
            let wangziAni;
            (function (wangziAni) {
                wangziAni["standby"] = "standby";
                wangziAni["win"] = "win";
                wangziAni["walk"] = "walk";
            })(wangziAni = Enum.wangziAni || (Enum.wangziAni = {}));
            let houseAni;
            (function (houseAni) {
                houseAni["box_01_open"] = "box_01_open";
                houseAni["box_02_open"] = "box_02_open";
                houseAni["box_01_static"] = "box_01_static";
                houseAni["box_02_static"] = "box_02_static";
            })(houseAni = Enum.houseAni || (Enum.houseAni = {}));
        })(Enum = lwg.Enum || (lwg.Enum = {}));
        let Click;
        (function (Click) {
            function on(effect, audioUrl, target, caller, down, move, up, out) {
                let btnEffect;
                if (audioUrl) {
                    Click.audioUrl = audioUrl;
                }
                else {
                    Click.audioUrl = Enum.voiceUrl.btn;
                }
                switch (effect) {
                    case 'noEffect':
                        btnEffect = new Btn_NoEffect();
                        break;
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
                        btnEffect = new Btn_LargenEffect();
                        break;
                }
                target.on(Laya.Event.MOUSE_DOWN, caller, down === null ? btnEffect.down : down);
                target.on(Laya.Event.MOUSE_MOVE, caller, move === null ? btnEffect.move : move);
                target.on(Laya.Event.MOUSE_UP, caller, up === null ? btnEffect.up : up);
                target.on(Laya.Event.MOUSE_OUT, caller, out === null ? btnEffect.out : out);
            }
            Click.on = on;
            function off(effect, target, caller, down, move, up, out) {
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
                target.off(Laya.Event.MOUSE_DOWN, caller, down === null ? btnEffect.down : down);
                target.off(Laya.Event.MOUSE_MOVE, caller, move === null ? btnEffect.move : move);
                target.off(Laya.Event.MOUSE_UP, caller, up === null ? btnEffect.up : up);
                target.off(Laya.Event.MOUSE_OUT, caller, out === null ? btnEffect.out : out);
            }
            Click.off = off;
        })(Click = lwg.Click || (lwg.Click = {}));
        class Btn_NoEffect {
            constructor() {
            }
            down(event) {
                console.log('无点击效果的点击');
            }
            move(event) {
            }
            up(event) {
            }
            out(event) {
            }
        }
        lwg.Btn_NoEffect = Btn_NoEffect;
        class Btn_LargenEffect {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(1.1, 1.1);
                if (lwg.Global._voiceSwitch) {
                    Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
                }
            }
            move(event) {
                event.currentTarget.scale(1, 1);
            }
            up(event) {
                event.currentTarget.scale(1, 1);
            }
            out(event) {
                event.currentTarget.scale(1, 1);
            }
        }
        lwg.Btn_LargenEffect = Btn_LargenEffect;
        class Btn_Balloon {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(Click.balloonScale + 0.06, Click.balloonScale + 0.06);
                Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
            }
            up(event) {
                event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
            }
            move(event) {
                event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
            }
            out(event) {
                event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
            }
        }
        lwg.Btn_Balloon = Btn_Balloon;
        class Btn_Beetle {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(Click.beetleScale + 0.06, Click.beetleScale + 0.06);
                Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
            }
            up(event) {
                event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
            }
            move(event) {
                event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
            }
            out(event) {
                event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
            }
        }
        lwg.Btn_Beetle = Btn_Beetle;
        let Animation;
        (function (Animation) {
            function simple_Rotate(node, Frotate, Erotate, time, func) {
                node.rotation = Frotate;
                Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), 0);
            }
            Animation.simple_Rotate = simple_Rotate;
            function upDown_Overturn(node, time, func) {
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
            Animation.upDown_Overturn = upDown_Overturn;
            function leftRight_Overturn(node, time, func) {
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
            Animation.leftRight_Overturn = leftRight_Overturn;
            function leftRight_Shake(node, range, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }));
                    }));
                }), delayed);
            }
            Animation.leftRight_Shake = leftRight_Shake;
            function upDwon_Shake(node, time, range, func) {
                Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }));
                    }));
                }));
            }
            Animation.upDwon_Shake = upDwon_Shake;
            function fadeOut(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.fadeOut = fadeOut;
            function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.fadeOut_KickBack = fadeOut_KickBack;
            function move_FadeOut(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.scale(0, 0);
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_FadeOut = move_FadeOut;
            function move_FadeOut_Scale(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.targetX = 0;
                node.targetY = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_FadeOut_Scale = move_FadeOut_Scale;
            function drop_Simple(node, targetY, rotation, time, delayed, func) {
                Laya.Tween.to(node, { y: targetY, rotation: rotation }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.drop_Simple = drop_Simple;
            function drop_KickBack(target, fAlpha, firstY, targetY, extendY, time1, delayed, func) {
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
            Animation.drop_KickBack = drop_KickBack;
            function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.drop_Excursion = drop_Excursion;
            function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func) {
                node.y = initialY;
                node.rotation = initialR;
                Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.goUp_Simple = goUp_Simple;
            function cardRotateX_TowFace(node, arr, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
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
            Animation.cardRotateX_TowFace = cardRotateX_TowFace;
            function cardRotateX_OneFace(node, func1, time, delayed, func2) {
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
            Animation.cardRotateX_OneFace = cardRotateX_OneFace;
            function cardRotateY_TowFace(node, arr, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
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
            Animation.cardRotateY_TowFace = cardRotateY_TowFace;
            function cardRotateY_OneFace(node, func1, time, delayed, func2) {
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
            Animation.cardRotateY_OneFace = cardRotateY_OneFace;
            function move_changeRotate(node, targetX, targetY, per, rotation_pe, time, func) {
                let targetPerX = targetX * per + node.x * (1 - per);
                let targetPerY = targetY * per + node.y * (1 - per);
                Laya.Tween.to(node, { x: targetPerX, y: targetPerY, rotation: 45 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: targetX, y: targetY, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), 0);
            }
            Animation.move_changeRotate = move_changeRotate;
            function bombs_Appear(node, firstAlpha, firstScale, scale1, rotation, time1, time2, delayed, audioType, func) {
                node.scale(0, 0);
                node.alpha = firstAlpha;
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, rotation: rotation }, time1, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.2, scaleY: firstScale + (scale1 - firstScale) * 0.2, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.bombs_Appear = bombs_Appear;
            function bombs_Vanish(node, scale, alpha, rotation, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.bombs_Vanish = bombs_Vanish;
            function swell_shrink(node, firstScale, scale1, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.5, scaleY: firstScale + (scale1 - firstScale) * 0.5, rotation: 0 }, time * 0.5, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.swell_shrink = swell_shrink;
            function move_Simple(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_Simple = move_Simple;
            function move_Deform_X(node, firstX, firstR, targetX, scaleX, scaleY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.rotation = firstR;
                Laya.Tween.to(node, { x: targetX, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.move_Deform_X = move_Deform_X;
            function move_Deform_Y(target, firstY, firstR, targeY, scaleX, scaleY, time, delayed, func) {
                target.alpha = 0;
                if (firstY) {
                    target.y = firstY;
                }
                target.rotation = firstR;
                Laya.Tween.to(target, { y: targeY, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.move_Deform_Y = move_Deform_Y;
            function blink_FadeOut(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.blink_FadeOut = blink_FadeOut;
            function HintAni_01(target, upNum, time1, stopTime, downNum, time2, func) {
                target.alpha = 0;
                Laya.Tween.to(target, { alpha: 1, y: target.y - upNum }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: target.y - 15 }, stopTime, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { alpha: 0, y: target.y + upNum + downNum }, time2, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation.HintAni_01 = HintAni_01;
            function rotate_Magnify_KickBack(node, eAngle, eScale, time1, time2, delayed1, delayed2, func) {
                node.alpha = 0;
                node.scaleX = 0;
                node.scaleY = 0;
                Laya.Tween.to(node, { alpha: 1, rotation: 360 + eAngle, scaleX: 1 + eScale, scaleY: 1 + eScale }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { rotation: 360 - eAngle / 2, scaleX: 1 + eScale / 2, scaleY: 1 + eScale / 2 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { rotation: 360 + eAngle / 3, scaleX: 1 + eScale / 5, scaleY: 1 + eScale / 5 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { rotation: 360, scaleX: 1, scaleY: 1 }, time2, null, Laya.Handler.create(this, function () {
                                node.rotation = 0;
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), delayed2);
                    }), 0);
                }), delayed1);
            }
            Animation.rotate_Magnify_KickBack = rotate_Magnify_KickBack;
        })(Animation = lwg.Animation || (lwg.Animation = {}));
        let PalyAudio;
        (function (PalyAudio) {
            function playSound(url, number) {
                Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () { }));
            }
            PalyAudio.playSound = playSound;
            function playMusic(url, number, deley) {
                Laya.SoundManager.playMusic(url, number, Laya.Handler.create(this, function () { }), deley);
            }
            PalyAudio.playMusic = playMusic;
            function stopMusic() {
                Laya.SoundManager.stopMusic();
            }
            PalyAudio.stopMusic = stopMusic;
        })(PalyAudio = lwg.PalyAudio || (lwg.PalyAudio = {}));
        let Tools;
        (function (Tools) {
            function drawPieMask(parent, startAngle, endAngle) {
                parent.cacheAs = "bitmap";
                let drawPieSpt = new Laya.Sprite();
                drawPieSpt.blendMode = "destination-out";
                parent.addChild(drawPieSpt);
                let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                return drawPie;
            }
            Tools.drawPieMask = drawPieMask;
            function transitionScreenPointfor3D(v3, camera) {
                let ScreenV3 = new Laya.Vector3();
                camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV3);
                let point = new Laya.Vector2();
                point.x = ScreenV3.x;
                point.y = ScreenV3.y;
                return point;
            }
            Tools.transitionScreenPointfor3D = transitionScreenPointfor3D;
            function random(n, m) {
                m = m || 10;
                const c = m - n + 1;
                return Math.floor(Math.random() * c + n);
            }
            Tools.random = random;
            function getRandomArrayElements(arr, count) {
                var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
                while (i-- > min) {
                    index = Math.floor((i + 1) * Math.random());
                    temp = shuffled[index];
                    shuffled[index] = shuffled[i];
                    shuffled[i] = temp;
                }
                return shuffled.slice(min);
            }
            Tools.getRandomArrayElements = getRandomArrayElements;
            function getArrayDifElements(arr, count) {
                const result = [];
                let i = 0;
                for (i; i < count; i++) {
                    const temp = getDiffEle(arr.slice(), result, i);
                    result.push(temp);
                }
                return result;
            }
            Tools.getArrayDifElements = getArrayDifElements;
            function getDiffEle(arr, result, place) {
                let indexArr = [];
                let i = 0;
                for (i; i < arr.length - place; i++) {
                    indexArr.push(i);
                }
                const ranIndex = Math.floor(Math.random() * indexArr.length);
                if (result.indexOf(arr[ranIndex]) === -1) {
                    const backNum = arr[ranIndex];
                    arr[ranIndex] = arr[indexArr.length - 1];
                    return backNum;
                }
                else {
                    arr.splice(ranIndex, 1);
                    return getDiffEle(arr, result, place);
                }
            }
            Tools.getDiffEle = getDiffEle;
            Tools.roleDragCan = false;
            function copydata(obj) {
                const ret = {};
                Object.getOwnPropertyNames(obj).forEach(name => {
                    ret[name] = obj[name];
                });
                return ret;
            }
            Tools.copydata = copydata;
            function fillArray(value, len) {
                var arr = [];
                for (var i = 0; i < len; i++) {
                    arr.push(value);
                }
                return arr;
            }
            Tools.fillArray = fillArray;
            function speedByAngle(angle, XY) {
                if (angle % 90 === 0 || !angle) {
                    console.error("计算的角度异常,需要查看：", angle);
                    return;
                }
                let speedXY = { x: 0, y: 0 };
                speedXY.y = XY.y;
                speedXY.x = speedXY.y / Math.tan(angle * Math.PI / 180);
                return speedXY;
            }
            Tools.speedByAngle = speedByAngle;
            function speedXYByAngle(angle, speed) {
                const speedXY = { x: 0, y: 0 };
                speedXY.x = speed * Math.cos(angle * Math.PI / 180);
                speedXY.y = speed * Math.sin(angle * Math.PI / 180);
                return speedXY;
            }
            Tools.speedXYByAngle = speedXYByAngle;
            function speedLabelByAngle(angle, speed, speedBate) {
                const speedXY = { x: 0, y: 0 };
                const selfAngle = angle;
                const defaultSpeed = speed;
                const bate = speedBate || 1;
                if (selfAngle % 90 === 0) {
                    if (selfAngle === 0 || selfAngle === 360) {
                        speedXY.x = Math.abs(defaultSpeed) * bate;
                    }
                    else if (selfAngle === 90) {
                        speedXY.y = Math.abs(defaultSpeed) * bate;
                    }
                    else if (selfAngle === 180) {
                        speedXY.x = -Math.abs(defaultSpeed) * bate;
                    }
                    else {
                        speedXY.y = -Math.abs(defaultSpeed) * bate;
                    }
                }
                else {
                    const tempXY = Tools.speedXYByAngle(selfAngle, defaultSpeed);
                    speedXY.x = tempXY.x;
                    speedXY.y = tempXY.y;
                    if (selfAngle > 0 && selfAngle < 180) {
                        speedXY.y = Math.abs(speedXY.y) * bate;
                    }
                    else {
                        speedXY.y = -Math.abs(speedXY.y) * bate;
                    }
                    if (selfAngle > 90 && selfAngle < 270) {
                        speedXY.x = -Math.abs(speedXY.x) * bate;
                    }
                    else {
                        speedXY.x = Math.abs(speedXY.x) * bate;
                    }
                }
                return speedXY;
            }
            Tools.speedLabelByAngle = speedLabelByAngle;
            function getRad(degree) {
                return degree / 180 * Math.PI;
            }
            Tools.getRad = getRad;
            function getRoundPos(angle, radius, centPos) {
                var center = centPos;
                var radius = radius;
                var hudu = (2 * Math.PI / 360) * angle;
                var X = center.x + Math.sin(hudu) * radius;
                var Y = center.y - Math.cos(hudu) * radius;
                return { x: X, y: Y };
            }
            Tools.getRoundPos = getRoundPos;
            function converteNum(num) {
                if (typeof (num) !== "number") {
                    console.warn("要转化的数字并不为number");
                    return num;
                }
                let backNum;
                if (num < 1000) {
                    backNum = "" + num;
                }
                else if (num < 1000000) {
                    backNum = "" + (num / 1000).toFixed(1) + "k";
                }
                else if (num < 10e8) {
                    backNum = "" + (num / 1000000).toFixed(1) + "m";
                }
                else {
                    backNum = "" + num;
                }
                return backNum;
            }
            Tools.converteNum = converteNum;
        })(Tools = lwg.Tools || (lwg.Tools = {}));
    })(lwg || (lwg = {}));

    class UIDefeated extends lwg.Admin.Scene {
        constructor() { super(); }
        lwgInit() {
            this.self = this.owner;
            this.BtnAgain = this.self['BtnAgain'];
            this.BtnLast = this.self['BtnLast'];
            this.BtnShare = this.self['BtnShare'];
            this.BtnExAdv = this.self['BtnExAdv'];
            this.LvNum = this.self['LvNum'];
            this.LvNumDisplay();
        }
        adaptive() {
            this.self['sceneContent'].y = Laya.stage.height / 2;
        }
        LvNumDisplay() {
            if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                this.LvNum.value = lwg.Global._gameLevel.toString();
            }
            else {
                this.LvNum.value = lwg.Admin.openLevelNum.toString();
            }
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.BtnAgain, this, null, null, this.BtnAgainUp, null);
            lwg.Click.on('largen', null, this.BtnLast, this, null, null, this.BtnLastUp, null);
            lwg.Click.on('largen', null, this.BtnShare, this, null, null, this.BtnShareUp, null);
            lwg.Click.on('largen', null, this.BtnExAdv, this, null, null, this.BtnExAdvUp, null);
        }
        BtnAgainUp(event) {
            event.currentTarget.scale(1, 1);
            if (lwg.Global._execution < 2) {
                lwg.Admin._openScene('UIExecutionHint', null, null, null);
            }
            else {
                lwg.Global._execution -= 2;
                lwg.LocalStorage.addData();
                lwg.Admin._refreshScene();
            }
        }
        BtnLastUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._createHint(lwg.Enum.HintType.noAdv);
        }
        BtnShareUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._createHint(lwg.Enum.HintType.noShare);
        }
        BtnExAdvUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._createHint(lwg.Enum.HintType.noAdv);
        }
        onDisable() {
        }
    }

    class UIExecutionHint extends lwg.Admin.Scene {
        lwgInit() {
            lwg.Global._stageClick = false;
        }
        adaptive() {
            this.self['sceneContent'].y = Laya.stage.height * 0.481;
        }
        btnOnClick() {
            lwg.Click.on(lwg.Enum.ClickType.noEffect, null, this.self['BtnGet'], this, null, null, this.btnGetUp, null);
            lwg.Click.on(lwg.Enum.ClickType.noEffect, null, this.self['BtnClose'], this, null, null, this.btnCloseUp, null);
            lwg.Click.on(lwg.Enum.ClickType.largen, null, this.self['Btn'], this, null, null, null, null);
        }
        btnGetUp(event) {
            this.btnGetUp_advFunc();
        }
        btnGetUp_advFunc() {
            lwg.Global._execution += 5;
            let num = lwg.Global.ExecutionNumNode.getChildByName('Num');
            num.value = (Number(num.value) + 5).toString();
            lwg.LocalStorage.addData();
            lwg.Global._stageClick = true;
            this.self.close();
        }
        btnCloseUp(event) {
            lwg.Global._stageClick = true;
            this.self.close();
        }
    }

    class UIMain extends lwg.Admin.Scene {
        constructor() {
            super();
        }
        lwgInit() {
            Laya.MouseManager.multiTouchEnabled = false;
            this.BtnAgain = this.self['BtnAgain'];
            this.Wangzi = this.self['Wangzi'];
            this.KeyNum = this.self['KeyNum'];
            this.Gongzhu = this.self['Gongzhu'];
            lwg.Global._gameStart = true;
            if (lwg.Global._execution <= 0) {
                lwg.Global._execution = 0;
            }
            lwg.Global._createGoldNum(this.self);
            lwg.Global._createExecutionNum(this.self);
            lwg.Global._createBtnAgain(this.self);
            lwg.Global._createBtnPause(this.self);
            lwg.Global._createBtnHint(this.self);
        }
        BtnAgainUp(event) {
            lwg.Admin._refreshScene();
        }
        onUpdate() {
        }
        onDisable() {
        }
    }

    class UILoding extends lwg.Admin.Scene {
        constructor() {
            super(...arguments);
            this.mianSceneOk = false;
            this.time = 0;
        }
        lwgInit() {
            this.Mask = this.self['Mask'];
            lwg.Global._gameLevel = 1;
            if (lwg.Global._voiceSwitch) {
                lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
            }
            lwg.Sk.skLoding();
            this.lodeUserInfo();
            this.dataLoading();
        }
        dataLoading() {
            Laya.loader.load("Data/HintDec.json", Laya.Handler.create(this, this.levelsOnLoaded), null, Laya.Loader.JSON);
        }
        levelsOnLoaded() {
            lwg.Global._hintDec = Laya.loader.getRes("Data/HintDec.json")["RECORDS"];
            Laya.MouseManager.multiTouchEnabled = false;
        }
        lodeMianScene3D() {
            Laya.Scene3D.load("testScene/LayaScene_GameMain/Conventional/GameMain.ls", Laya.Handler.create(this, this.mianSceneComplete));
        }
        mianSceneComplete(scene) {
            Laya.stage.addChildAt(scene, 0);
            scene.addComponent(UIMain);
            this.Mask.x = 0;
            lwg.Admin._openScene('UIStart', 1, this.self, null);
            this.lodeUserInfo();
            this.mianSceneOk = true;
        }
        lodeUserInfo() {
            let data = lwg.LocalStorage.getData();
            if (data) {
                lwg.Global._gameLevel = data._gameLevel;
                lwg.Global._goldNum = data._goldNum;
                lwg.Global._execution = data._execution;
            }
        }
        onUpdate() {
            this.time++;
            if (this.time === 60) {
                this.Mask.x = -72;
                lwg.Admin._openScene('UIStart', 0, this.self, null);
            }
            else if (this.time === 80) ;
        }
        onDisable() {
        }
    }

    class UIMain_Aisle extends lwg.Admin.Object {
        constructor() {
            super();
            this.openSwitch = false;
            this.connectRoom = null;
            this.locks = false;
        }
        lwgInit() {
            this.interactionPicStyle('exit');
            this.picColor();
        }
        picColor() {
            let parent = this.self.parent;
            let pSkin = parent.skin;
            let wall = this.self.getChildByName('wall');
            let color = this.self.getChildByName('color');
            switch (pSkin) {
                case lwg.Enum.RoomSkin.blue:
                    wall.skin = lwg.Enum.WallSkin.blue;
                    color.skin = lwg.Enum.AisleColorSkin.blue;
                    break;
                case lwg.Enum.RoomSkin.bluish:
                    wall.skin = lwg.Enum.WallSkin.bluish;
                    color.skin = lwg.Enum.AisleColorSkin.bluish;
                    break;
                case lwg.Enum.RoomSkin.grass:
                    wall.skin = lwg.Enum.WallSkin.grass;
                    color.skin = lwg.Enum.AisleColorSkin.grass;
                    break;
                case lwg.Enum.RoomSkin.green:
                    wall.skin = lwg.Enum.WallSkin.green;
                    color.skin = lwg.Enum.AisleColorSkin.green;
                    break;
                case lwg.Enum.RoomSkin.pink:
                    wall.skin = lwg.Enum.WallSkin.pink;
                    color.skin = lwg.Enum.AisleColorSkin.pink;
                    break;
                case lwg.Enum.RoomSkin.purple:
                    wall.skin = lwg.Enum.WallSkin.purple;
                    color.skin = lwg.Enum.AisleColorSkin.purple;
                    break;
                case lwg.Enum.RoomSkin.red:
                    wall.skin = lwg.Enum.WallSkin.red;
                    color.skin = lwg.Enum.AisleColorSkin.red;
                    break;
                case lwg.Enum.RoomSkin.yellow:
                    wall.skin = lwg.Enum.WallSkin.yellow;
                    color.skin = lwg.Enum.AisleColorSkin.yellow;
                    break;
                case lwg.Enum.RoomSkin.yellowish:
                    wall.skin = lwg.Enum.WallSkin.yellowish;
                    color.skin = lwg.Enum.AisleColorSkin.yellowish;
                    break;
                default:
                    break;
            }
        }
        onTriggerEnter(other, self) {
            let otherName = other.owner.name;
            let selfName = this.self.name;
            if (other.label === 'aisle' && self.label === 'aisle') {
                if (this.oppositeAisle) {
                    this.oppositeAisle['UIMain_Aisle'].openSwitch = true;
                    this.openSwitch = true;
                }
            }
            else if (other.label === 'interaction' && self.label === 'interaction') {
                let n1 = otherName.substring(0, 1);
                let n2 = selfName.substring(0, 1);
                if ((n1 === 'l' && n2 === 'r') || (n1 === 'r' && n2 === 'l') || (n1 === 'u' && n2 === 'd') || (n1 === 'd' && n2 === 'u')) {
                    this.connectRoom = other.owner.parent;
                    this.oppositeAisle = other.owner;
                    this.interactionPicStyle('enter');
                    this.roomAdsorption();
                }
            }
        }
        interactionPicStyle(type) {
            let interaction = this.self.getChildByName('interaction');
            let url1 = 'Room/ui_interaction_01.png';
            let url2 = 'Room/ui_interaction_02.png';
            if (type === 'enter') {
                interaction.skin = url2;
            }
            else if (type === 'exit') {
                interaction.skin = url1;
            }
        }
        roomAdsorption() {
            let posX = this.oppositeAisle.x + this.connectRoom.x - this.connectRoom.width / 2;
            let posY = this.oppositeAisle.y + this.connectRoom.y - this.connectRoom.height / 2;
            let parent = this.self.parent;
            let selfX = this.self.x + parent.x - parent.width / 2;
            let selfY = this.self.y + parent.y - parent.height / 2;
            let diffX = posX - selfX;
            let diffY = posY - selfY;
            if ((Math.abs(diffX) > 200 || Math.abs(diffY) > 200)) {
                return;
            }
            let _roomMove = parent['UIMain_Room']._roomMove;
            if (!_roomMove && lwg.Global._roomPickup === parent) {
                Laya.Tween.clearAll(this);
                lwg.Animation.move_Simple(parent, parent.x, parent.y, parent.x + diffX, parent.y + diffY, 10, 0, null);
                parent['UIMain_Room']._roomMove = false;
                lwg.Global._roomPickup = null;
                this.oppositeAisle['UIMain_Aisle'].openSwitch = true;
                this.openSwitch = true;
                this.gzAndWzConnect();
                lwg.Effects.createCommonExplosion(Laya.stage, 15, posX, posY);
            }
            else if ((Math.abs(diffX) > 10 || Math.abs(diffY) > 10) || parent['UIMain_Room']._roomMove) {
                this.openSwitch = false;
                this.oppositeAisle['UIMain_Aisle'].openSwitch = false;
                let wangzi = this.selfScene['UIMain'].Wangzi;
                wangzi['UIMain_Wangzi'].gzConnect = false;
            }
        }
        styleChanges() {
            let interaction = this.self.getChildByName('interaction');
            let color = this.self.getChildByName('color');
            let wall = this.self.getChildByName('wall');
            if (this.openSwitch) {
                interaction.alpha = 0;
                color.alpha = 0;
                wall.alpha = 1;
            }
            else {
                interaction.alpha = 1;
                color.alpha = 1;
                wall.alpha = 0;
            }
        }
        gzAndWzConnect() {
            let gongzhu = this.selfScene['UIMain'].Gongzhu;
            let wangzi = this.selfScene['UIMain'].Wangzi;
            let gongzhuRoom = gongzhu['UIMain_Gongzhu'].belongRoom;
            let wangziRoom = wangzi['UIMain_Wangzi'].belongRoom;
            let parent = this.self.parent;
            if ((gongzhuRoom === parent && wangziRoom === this.connectRoom) || (wangziRoom === parent && gongzhuRoom === this.connectRoom)) {
                console.log('公主的房间和王子的房间连接了！');
                wangzi['UIMain_Wangzi'].gzConnect = true;
            }
        }
        onTriggerExit(other, self) {
            let otherName = other.owner.name;
            let selfName = this.self.name;
            if (other.label === 'aisle' && self.label === 'aisle') ;
            else if (other.label === 'interaction' && self.label === 'interaction') {
                let n1 = otherName.substring(0, 1);
                let n2 = selfName.substring(0, 1);
                if ((n1 === 'l' && n2 === 'r') || (n1 === 'r' && n2 === 'l') || (n1 === 'u' && n2 === 'd') || (n1 === 'd' && n2 === 'u')) {
                    this.interactionPicStyle('exit');
                    this.openSwitch = false;
                    this.connectRoom = null;
                    this.oppositeAisle = null;
                    console.log('失去感应', n1, n2);
                }
            }
        }
        onUpdate() {
            if (this.connectRoom && this.oppositeAisle) {
                this.roomAdsorption();
            }
            this.styleChanges();
        }
        onDisable() {
        }
    }

    class UIMain_Gongzhu extends lwg.Admin.Person {
        constructor() {
            super(...arguments);
            this.necklace = false;
            this.drumstick = false;
            this.inAir = false;
            this.targetP = new Laya.Point();
            this.attackSwitch = false;
            this.speed = 2.5;
            this._belongX = null;
            this._belongY = null;
            this._belongChange = false;
        }
        lwgInit() {
            this.createskeleton();
            this.notCommon();
            this.createPlaint();
            this.setBelongRoom();
            this.directionJudge();
        }
        notCommon() {
            this.buffState = null;
            this.signSkin = 'Room/icon_love.png';
        }
        createPlaint() {
            let img = new Laya.Image();
            img.skin = this.signSkin;
            img.y = -50;
            img.x = this.self.width / 2 - 8 - img.width / 2;
            this.self.addChild(img);
            img.zOrder = 10;
            this.plaint = img;
        }
        directionJudge() {
            let pic = this.self.getChildByName('pic');
            if (pic.scaleX === -1) {
                this.moveDirection = lwg.Enum.PersonDir.left;
            }
            else if (pic.scaleX === 1) {
                this.moveDirection = lwg.Enum.PersonDir.right;
            }
        }
        createskeleton() {
            this.skeleton = lwg.Sk.gongzhuTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.pos(this.self.width / 2, this.self.height - 8);
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk, true);
        }
        setBelongRoom() {
            for (let index = 0; index < this.selfScene.numChildren; index++) {
                const child = this.selfScene.getChildAt(index);
                if (child.name.substring(0, 4) === 'Room') {
                    let dx = Math.abs(child.x - this.self.x);
                    let dy = Math.abs(child.y - this.self.y);
                    if (dx <= child.width / 2 && dy <= child.height / 2) {
                        this.belongRoom = child;
                        break;
                    }
                }
            }
        }
        onTriggerEnter(other, self) {
            if (!lwg.Global._gameStart) {
                return;
            }
            switch (other.label) {
                case 'wall':
                    this.wallAndPerson(other, self);
                    break;
                case 'floor':
                    this.floorAndPerson(other, self);
                    break;
                case 'ladder':
                    this.ladderAndPerson(other, self);
                    break;
                case 'aisle':
                    this.aisleAndPerson(other, self);
                    break;
                case 'dog':
                    this.dogAndPerson(other, self);
                    break;
                case 'wangzi':
                    this.wangziAndPerson(other, self);
                    break;
                case 'stick':
                    this.stickAndPerson(other, self);
                    break;
                case 'kettle':
                    this.kettleAndPerson(other, self);
                    break;
                case 'bonfire':
                    this.bonfireAndPerson(other, self);
                    break;
                case 'necklace':
                    this.necklaceAndPerson(other, self);
                    break;
                case 'speed':
                    this.speedAndPerson(other, self);
                    break;
                case 'banana':
                    this.bananaAndPerson(other, self);
                    break;
                case 'drumstick':
                    this.drumstickAndPerson(other, self);
                    break;
                case 'houma':
                    this.houmaAndPerson(other, self);
                    break;
                default:
                    break;
            }
        }
        houmaAndPerson(other, self) {
            console.log('houma');
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            if (this.drumstick) {
                return;
            }
            else {
                this.attackSwitch = true;
                otherOwner['UIMain_Houma'].attackSwitch = true;
                let apple = otherOwner.getChildByName('apple');
                apple.visible = true;
                Laya.timer.frameOnce(50, this, f => {
                    this.skeleton.play(lwg.Enum.gongzhuAni.die, false);
                    apple.visible = false;
                    Laya.timer.frameOnce(100, this, f => {
                        lwg.Admin._openScene('UIPassHint', null, null, null);
                    });
                });
            }
        }
        drumstickAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            otherOwner.removeSelf();
            this.drumstick = true;
        }
        bananaAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            otherOwner.removeSelf();
            lwg.Global._gameStart = false;
            this.skeleton.play(lwg.Enum.gongzhuAni.die, false);
            Laya.timer.frameOnce(100, this, f => {
                lwg.Admin._openScene('UIPassHint', null, null, null);
            });
        }
        speedAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            otherOwner.removeSelf();
            this.speed = this.speed * 2;
        }
        necklaceAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            this.necklace = true;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk_xianglian, true);
            otherOwner.removeSelf();
        }
        bonfireAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            if (this.buffState === lwg.Enum.BuffState.kettle) {
                this.skeleton.play(lwg.Enum.gongzhuAni.attack_shuihu, false);
                this.attackSwitch = true;
                Laya.timer.frameOnce(100, this, f => {
                    otherOwner.removeSelf();
                    this.attackSwitch = false;
                    this.skeleton.play(lwg.Enum.gongzhuAni.walk_shuihu, true);
                });
                this.skeleton.on(Laya.Event.LABEL, this, this.shuihuComplete, [otherOwner]);
            }
            else {
                lwg.Global._gameStart = false;
                Laya.timer.frameOnce(100, this, f => {
                    lwg.Admin._openScene('UIPassHint', null, null, null);
                });
            }
        }
        shuihuComplete() {
            console.log('浇水完毕');
        }
        kettleAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            this.buffState = lwg.Enum.BuffState.kettle;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk_shuihu, true);
            otherOwner.removeSelf();
        }
        stickAndPerson(other, self) {
            let otherOwner = other.owner;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk_gun, true);
            this.buffState = lwg.Enum.BuffState.stick;
            otherOwner.removeSelf();
        }
        dogAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            this.attackSwitch = true;
            if (otherOwnerName.substring(0, 1) === 'm') {
                otherOwner['Dog'].eatFood = true;
            }
            if (this.buffState === lwg.Enum.BuffState.stick) {
                this.skeleton.play(lwg.Enum.gongzhuAni.attack_gun, false);
                this.skeleton.on(Laya.Event.LABEL, this, this.attackComplete, [otherOwner]);
            }
            else {
                lwg.Global._gameStart = false;
                this.targetP.x = this.self.x;
                this.targetP.y = this.self.y;
                this.skeleton.play(lwg.Enum.gongzhuAni.die, false);
                if (otherOwnerName.substring(0, 1) === 's') {
                    otherOwner['UIMain_StaticDog'].skeleton.play(lwg.Enum.dogAni.walk, true);
                }
                else if (otherOwnerName.substring(0, 1) === 'm') {
                    otherOwner['Dog'].skeleton.play(lwg.Enum.dogAni.walk, true);
                }
                Laya.timer.frameOnce(100, this, f => {
                    lwg.Admin._openScene('UIPassHint', null, null, null);
                });
            }
        }
        attackComplete(otherOwner) {
            let otherOwnerName = otherOwner.name;
            if (otherOwnerName.substring(0, 1) === 's') {
                let dogSk = otherOwner['UIMain_StaticDog'].skeleton;
                dogSk.play(lwg.Enum.dogAni.die, false);
            }
            else if (otherOwnerName.substring(0, 1) === 'm') {
                otherOwner['Dog'].skeleton.play(lwg.Enum.dogAni.die);
            }
            this.skeleton.play(lwg.Enum.gongzhuAni.walk_gun, true);
            this.attackSwitch = false;
            Laya.timer.frameOnce(30, this, f => {
                otherOwner.removeSelf();
            });
        }
        wallAndPerson(other, self) {
            if (this.moveDirection === lwg.Enum.PersonDir.left || this.moveDirection === lwg.Enum.PersonDir.right) {
                this.changeDirection();
            }
        }
        wangziAndPerson(other, self) {
            lwg.Global._gameStart = false;
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            this.targetP.x = this.self.x;
            this.targetP.y = this.self.y;
            otherOwner['UIMain_Wangzi'].skeleton.play(lwg.Enum.wangziAni.win, true);
            this.skeleton.play(lwg.Enum.gongzhuAni.win, true);
            Laya.timer.frameOnce(60, this, f => {
                lwg.Admin._openScene('UIVictory', null, null, null);
            });
        }
        floorAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            let belongName = otherOwnerName.substring(otherOwnerName.length - 5, otherOwnerName.length);
            if (this.belongRoom.name === belongName) {
                if (this.personState === lwg.Enum.MoveState.onLadder) {
                    this.moveDirection = this.beforeLadderDir;
                }
                else if (this.personState === lwg.Enum.MoveState.inAir) {
                    this.moveDirection = this.beforeInAirDir;
                }
                this.personState = lwg.Enum.MoveState.onFloor;
                this.currentFloor = otherOwner;
            }
        }
        ladderAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherName = otherOwner.name;
            let otherNamelen = otherOwner.name.length;
            let num = otherOwner.name.substring(otherNamelen - 2, otherNamelen);
            let aisleName = 'up_Aisle_' + num;
            let upAisle = this.belongRoom.getChildByName(aisleName);
            if (!upAisle) {
                if (otherOwner.name.substring(0, 8) === 'ladder_a') {
                    console.log('这是自动上下梯子,直接上下');
                    if (this.personState !== lwg.Enum.MoveState.onLadder) {
                        if (other.y > otherOwner.width / 2) {
                            this.beforeLadderDir = this.moveDirection;
                            this.moveDirection = lwg.Enum.PersonDir.up;
                            this.personState = lwg.Enum.MoveState.onLadder;
                        }
                        else {
                            console.log('下去');
                            this.beforeLadderDir = this.moveDirection;
                            this.moveDirection = lwg.Enum.PersonDir.down;
                            this.personState = lwg.Enum.MoveState.onLadder;
                        }
                        this.currentLadder = otherOwner;
                    }
                }
                return;
            }
            let upOpenSwitch = upAisle['UIMain_Aisle'].openSwitch;
            if (!upOpenSwitch) {
                console.log('通道未打开，不会上梯子！');
            }
            else {
                console.log(otherOwner.name + '连接梯子');
                if (this.personState === lwg.Enum.MoveState.onFloor) {
                    this.beforeLadderDir = this.moveDirection;
                    this.moveDirection = lwg.Enum.PersonDir.up;
                    this.personState = lwg.Enum.MoveState.onLadder;
                }
                else {
                    if (this.beforeInAirDir === lwg.Enum.PersonDir.left || this.beforeInAirDir === lwg.Enum.PersonDir.right) {
                        this.beforeLadderDir = this.beforeInAirDir;
                        this.personState = lwg.Enum.MoveState.onLadder;
                        this.moveDirection = lwg.Enum.PersonDir.down;
                    }
                }
                this.currentLadder = otherOwner;
            }
        }
        aisleAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherName = otherOwner.name;
            let openSwitch = otherOwner['UIMain_Aisle'].openSwitch;
            let connectRoom = otherOwner['UIMain_Aisle'].connectRoom;
            let otherDir = otherName.substring(0, 1);
            let selfDir = this.moveDirection.substring(0, 1);
            if (otherDir === 'l' || otherDir === 'r') {
                if (openSwitch === false) {
                    let lrAisle = this.belongRoom.getChildByName(otherOwner.name);
                    if (otherOwner === lrAisle) {
                        this.changeDirection();
                    }
                }
                else {
                    if (otherDir === selfDir) {
                        if (this.belongRoom !== connectRoom) {
                            this.belongRoom = connectRoom;
                            this._belongChange = true;
                            this.beforeInAirDir = this.moveDirection;
                            this.personState = lwg.Enum.MoveState.inAir;
                        }
                    }
                }
            }
            else if (otherDir === 'd' || otherDir === 'u') {
                if (otherDir === 'd') {
                    if (openSwitch === false) {
                        console.log('啥也不做！');
                    }
                    else {
                        if (selfDir === 'l' || selfDir === 'r') {
                            if (this.belongRoom !== connectRoom) {
                                this.belongRoom = connectRoom;
                                this._belongChange = true;
                                this.beforeInAirDir = this.moveDirection;
                                this.personState = lwg.Enum.MoveState.inAir;
                                this.moveDirection = lwg.Enum.PersonDir.down;
                                console.log('下通道连接，准备下去' + this.beforeInAirDir);
                            }
                        }
                    }
                }
                else if (otherDir === 'u') {
                    if (openSwitch === false) {
                        let upAisle = this.belongRoom.getChildByName(otherOwner.name);
                        if (otherOwner === upAisle) {
                            console.log('上面不通换方向' + this.personState);
                            this.changeDirection();
                        }
                    }
                    else {
                        if (otherDir === selfDir) {
                            if (this.belongRoom !== connectRoom) {
                                this.belongRoom = connectRoom;
                                this._belongChange = true;
                                this.beforeInAirDir = this.beforeLadderDir;
                                this.personState = lwg.Enum.MoveState.inAir;
                                console.log('向上交换房间');
                            }
                        }
                    }
                }
            }
        }
        onTriggerExit(other, self) {
            if (!lwg.Global._gameStart) {
                return;
            }
            if (other.label === 'floor') {
                let belongName = other.owner.name.substring(other.owner.name.length - 5, other.owner.name.length);
                if (this.belongRoom.name === belongName) {
                    if (this.personState !== lwg.Enum.MoveState.onLadder) {
                        this.beforeInAirDir = this.moveDirection;
                        this.personState = lwg.Enum.MoveState.inAir;
                        this.moveDirection = lwg.Enum.PersonDir.down;
                        console.log(other.owner.name + '退出' + this.personState);
                    }
                }
            }
            else if (other.label === 'ladder') {
                let belongName = other.owner.name.substring(other.owner.name.length - 5, other.owner.name.length);
                if (this.belongRoom.name === belongName) {
                    if (this.personState === lwg.Enum.MoveState.onFloor) {
                        this.moveDirection = this.beforeFloorDir;
                        console.log(other.owner.name + '退出' + this.personState);
                    }
                }
            }
        }
        changeDirection() {
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.moveDirection = lwg.Enum.PersonDir.right;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.moveDirection = lwg.Enum.PersonDir.left;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                this.moveDirection = lwg.Enum.PersonDir.down;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                this.moveDirection = lwg.Enum.PersonDir.up;
            }
        }
        move() {
            if (this.attackSwitch) {
                this.rig.setVelocity({ x: 0, y: 0 });
                return;
            }
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.rig.setVelocity({ x: -this.speed, y: 0 });
                this.skeleton.scaleX = -1;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.rig.setVelocity({ x: this.speed, y: 0 });
                this.skeleton.scaleX = 1;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                this.rig.setVelocity({ x: 0, y: -6 });
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                this.rig.setVelocity({ x: 0, y: 6 });
            }
        }
        noMoveDirection() {
            if (!this.moveDirection) {
                this.moveDirection = lwg.Enum.PersonDir.left;
            }
        }
        positionOffset() {
            if (this.belongRoom) {
                switch (this.personState) {
                    case lwg.Enum.MoveState.onFloor:
                        if (this.currentFloor) {
                            let y = this.currentFloor.y + this.belongRoom.y - this.belongRoom.height / 2;
                            this.self.y = y - 20;
                            this.positionOffsetXY();
                        }
                        break;
                    case lwg.Enum.MoveState.onLadder:
                        if (this.currentLadder) {
                            let x = this.currentLadder.x + this.belongRoom.x - this.belongRoom.width / 2;
                            this.self.x = x;
                            this.positionOffsetXY();
                        }
                        break;
                    case lwg.Enum.MoveState.inAir:
                        this.positionOffsetXY();
                        break;
                    default:
                        break;
                }
            }
        }
        positionOffsetXY() {
            if (!this._belongY || !this._belongX) {
                if (this.belongRoom) {
                    this._belongX = this.belongRoom.x;
                    this._belongY = this.belongRoom.y;
                }
            }
            else {
                if (this._belongChange) {
                    this._belongY = null;
                    this._belongChange = false;
                }
                else {
                    let x = this.belongRoom.x - this._belongX;
                    let y = this.belongRoom.y - this._belongY;
                    this.self.x = this.self.x + x;
                    this.self.y = this.self.y + y;
                    this._belongX = this.belongRoom.x;
                    this._belongY = this.belongRoom.y;
                }
            }
        }
        gameOverMove() {
            if (this.targetP) {
                this.positionOffsetXY();
            }
        }
        scopeControl() {
            if (this.belongRoom) {
                if (this.self.x > this.belongRoom.x + this.belongRoom.width / 2 + 30) {
                    this.self.x = this.belongRoom.x + this.belongRoom.width / 2 + 30;
                }
                if (this.self.x < this.belongRoom.x - this.belongRoom.width / 2 - 30) {
                    this.self.x = this.belongRoom.x - this.belongRoom.width / 2 - 30;
                }
                if (this.self.y > this.belongRoom.y + this.belongRoom.height / 2 + 30) {
                    this.self.y = this.belongRoom.y + this.belongRoom.height / 2 + 30;
                }
                if (this.self.y < this.belongRoom.y - this.belongRoom.height / 2 - 30) {
                    this.self.y = this.belongRoom.y - this.belongRoom.height / 2 - 30;
                }
            }
        }
        onUpdate() {
            if (!lwg.Global._gameStart) {
                this.rig.setVelocity({ x: 0, y: 0 });
                this.gameOverMove();
                return;
            }
            this.noMoveDirection();
            this.move();
            this.positionOffset();
            this.scopeControl();
        }
        onDisable() {
        }
    }

    class Dog extends UIMain_Gongzhu {
        constructor() {
            super(...arguments);
            this.eatFood = false;
        }
        notCommon() {
            this.signSkin = 'Room/icon_plaint.png';
        }
        createskeleton() {
            this.skeleton = lwg.Sk.gouTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height;
            this.skeleton.zOrder = 5;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            this.skeleton.play(lwg.Enum.dogAni.walk, true);
        }
        onTriggerEnter(other, self) {
            switch (other.label) {
                case 'wall':
                    this.wallAndPerson(other, self);
                    break;
                case 'floor':
                    this.floorAndPerson(other, self);
                    break;
                case 'ladder':
                    this.ladderAndPerson(other, self);
                    break;
                case 'aisle':
                    this.aisleAndPerson(other, self);
                    break;
                case 'wangzi':
                    break;
                case 'doghouse':
                    this.dogAndDoghouse(other, self);
                    break;
                case 'dogfood':
                    this.dogAnddogfood(other, self);
                    break;
                default:
                    break;
            }
        }
        dogAnddogfood(other, self) {
            console.log('吃了狗粮变大了');
            let otherOnwer = other.owner;
            let otherOnwerParent = otherOnwer.parent;
            this.skeleton.play(lwg.Enum.dogAni.standby, true);
            this.eatFood = true;
            self.width += 60;
            self.x -= 35;
            this.self.x = otherOnwer.x + otherOnwerParent.x - otherOnwerParent.width / 2;
            other.owner.removeSelf();
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.skeleton.scale(1.5, 1.5);
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.skeleton.scale(-1.5, 1.5);
            }
        }
        dogAndDoghouse(other, self) {
            this.self.removeSelf();
            let sleepPic = other.owner.getChildByName('sleepPic');
            sleepPic.visible = true;
        }
        move() {
            if (this.eatFood) {
                this.rig.setVelocity({ x: 0, y: 0 });
            }
            else {
                if (this.moveDirection === lwg.Enum.PersonDir.left) {
                    this.rig.setVelocity({ x: -this.speed, y: 0 });
                    this.skeleton.scaleX = 1;
                    this.plaint.x = 20;
                }
                else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                    this.rig.setVelocity({ x: this.speed, y: 0 });
                    this.skeleton.scaleX = -1;
                    this.plaint.x = 30;
                }
                else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                    this.rig.setVelocity({ x: 0, y: -6 });
                }
                else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                    this.rig.setVelocity({ x: 0, y: 6 });
                }
            }
        }
        onUpdate() {
            if (!lwg.Global._gameStart) {
                this.rig.setVelocity({ x: 0, y: 0 });
                this.gameOverMove();
                return;
            }
            if (!this.speed) {
                this.speed = 2.1;
            }
            this.noMoveDirection();
            this.move();
            this.positionOffset();
            this.scopeControl();
        }
    }

    class UIMain_Rival extends UIMain_Gongzhu {
        notCommon() {
        }
        createskeleton() {
            let num = Math.floor(Math.random() * 2);
            if (num === 1) {
                this.skeleton = lwg.Sk.qingdi_01Tem.buildArmature(0);
            }
            else {
                this.skeleton = lwg.Sk.qingdi_02Tem.buildArmature(0);
            }
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height - 10;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk, true);
        }
        onTriggerEnter(other, self) {
            if (!lwg.Global._gameStart) {
                return;
            }
            switch (other.label) {
                case 'wall':
                    this.wallAndPerson(other, self);
                    break;
                case 'floor':
                    this.floorAndPerson(other, self);
                    break;
                case 'ladder':
                    this.ladderAndPerson(other, self);
                    break;
                case 'aisle':
                    this.aisleAndPerson(other, self);
                    break;
                case 'wangzi':
                    this.wangziAndPerson(other, self);
                    break;
                default:
                    break;
            }
        }
        wangziAndPerson(other, self) {
            lwg.Global._gameStart = false;
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            this.targetP.x = this.self.x;
            this.targetP.y = this.self.y;
            otherOwner['UIMain_Wangzi'].skeleton.play(lwg.Enum.wangziAni.win, true);
            let gz = this.selfScene['UIMain'].Gongzhu;
            if (gz['UIMain_Gongzhu'].necklace) {
                gz['UIMain_Gongzhu'].skeleton.play(lwg.Enum.gongzhuAni.die_xianglian, false);
            }
            else {
                gz['UIMain_Gongzhu'].skeleton.play(lwg.Enum.gongzhuAni.die, false);
            }
            this.skeleton.play(lwg.Enum.gongzhuAni.win, true);
            Laya.timer.frameOnce(100, this, f => {
                lwg.Admin._openScene('UIDefeated', null, null, null);
            });
        }
    }

    class UIMain_Bonfire extends lwg.Admin.Object {
        lwgInit() {
            this.ani = this.self.getChildByName('ani');
            this.time = 0;
        }
        onUpdate() {
            this.time++;
            let url1 = 'Room/ani_fire_01.png';
            let url2 = 'Room/ani_fire_02.png';
            let url3 = 'Room/ani_fire_03.png';
            let speed = 5;
            if (this.time % (speed * 3) === 0) {
                this.ani.skin = url3;
            }
            else if (this.time % (speed * 2) === 0) {
                this.ani.skin = url2;
            }
            else if (this.time % speed === 0) {
                this.ani.skin = url1;
            }
        }
    }

    class UIMain_Wangzi extends UIMain_Gongzhu {
        constructor() {
            super(...arguments);
            this.aniSwitch = false;
        }
        notCommon() {
            this.gzConnect = false;
            this.signSkin = 'Room/icon_love.png';
        }
        createskeleton() {
            this.skeleton = lwg.Sk.wangziTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height - 12;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            if (pic.scaleX === -1) {
                this.skeleton.scaleX = 1;
            }
            else {
                this.skeleton.scaleX = -1;
            }
            this.skeleton.play(lwg.Enum.wangziAni.standby, true);
        }
        onTriggerEnter(other, self) {
            if (!lwg.Global._gameStart) {
                return;
            }
            switch (other.label) {
                case 'wall':
                    this.wallAndPerson(other, self);
                    break;
                case 'floor':
                    this.floorAndPerson(other, self);
                    break;
                case 'ladder':
                    this.ladderAndPerson(other, self);
                    break;
                case 'aisle':
                    this.aisleAndPerson(other, self);
                    break;
                default:
                    break;
            }
        }
        move() {
            if (!this.gzConnect) {
                if (this.aniSwitch) {
                    this.skeleton.play(lwg.Enum.wangziAni.standby, true);
                    this.aniSwitch = false;
                }
                this.rig.setVelocity({ x: 0, y: 0 });
                return;
            }
            if (!this.aniSwitch) {
                this.skeleton.play(lwg.Enum.wangziAni.walk, true);
                this.aniSwitch = true;
            }
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.rig.setVelocity({ x: -2.5, y: 0 });
                this.skeleton.scaleX = -1;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.rig.setVelocity({ x: 2.5, y: 0 });
                this.skeleton.scaleX = 1;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                this.rig.setVelocity({ x: 0, y: -6 });
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                this.rig.setVelocity({ x: 0, y: 6 });
            }
        }
        onUpdate() {
            if (!lwg.Global._gameStart) {
                this.rig.setVelocity({ x: 0, y: 0 });
                this.gameOverMove();
                return;
            }
            let necklace = this.self.scene['UIMain'].Gongzhu['UIMain_Gongzhu'].necklace;
            if (necklace) {
                this.noMoveDirection();
                this.move();
                this.scopeControl();
            }
            this.positionOffset();
        }
    }

    class UIMain_Follow extends lwg.Admin.Object {
        constructor() {
            super();
            this.firstPos = new Laya.Point();
        }
        lwgInit() {
            this.self = this.owner;
            let parent = this.self.parent;
            this.firstPos.y = this.self.y;
            this.firstPos.x = this.self.x;
        }
        createskeleton_StaticDog() {
            this.skeleton = lwg.Sk.gouTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height - 5;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            this.skeleton.play(lwg.Enum.dogAni.standby, true);
        }
        onUpdate() {
            if (this.self.name !== 'Person') {
                this.self.x = this.firstPos.x;
                this.self.y = this.firstPos.y;
            }
        }
        onDisable() {
        }
    }

    class UIMain_Houzi extends lwg.Admin.Object {
        constructor() {
            super(...arguments);
            this.timeSwitch = true;
        }
        lwgInit() {
            this.createskeleton();
            let Progress = this.self.getChildByName('Progress');
            let ProgressBar = Progress.getChildByName('ProgressBar');
            this.Mask = ProgressBar.mask;
        }
        createskeleton() {
            this.skeleton = lwg.Sk.houziTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            this.skeleton.play(lwg.Enum.dogAni.standby, true);
        }
        createBanana() {
            let banana;
            let self = this.self;
            let parent1 = this.self.parent;
            Laya.loader.load('prefab/banana.json', Laya.Handler.create(this, function (prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                banana = Laya.Pool.getItemByCreateFun('banana', _prefab.create, _prefab);
                parent1.addChild(banana);
                banana.pos(self.x, self.y + 4);
                banana.addComponent(UIMain_Follow);
                self.visible = false;
            }));
        }
        onUpdate() {
            if (this.timeSwitch && lwg.Global._gameLevel) {
                if (this.Mask.x > -78) {
                    if (!this.eatSpeed) {
                        this.eatSpeed = 1;
                    }
                    this.Mask.x -= this.eatSpeed * 0.1;
                }
                else {
                    this.timeSwitch = false;
                    console.log('丢下香蕉');
                    this.createBanana();
                }
            }
        }
    }

    class UIMain_StaticDog extends lwg.Admin.Object {
        lwgInit() {
            this.skeleton = lwg.Sk.gouTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            if (pic.scaleX === -1) {
                this.skeleton.scaleX = -1;
            }
            else {
                this.skeleton.scaleX = 1;
            }
            this.skeleton.play(lwg.Enum.dogAni.standby, true);
            this.createPlaint();
        }
        createPlaint() {
            let img = new Laya.Image();
            img.skin = 'Room/icon_plaint.png';
            img.y = -40;
            img.x = this.self.width / 2;
            this.self.addChild(img);
            img.zOrder = 10;
            this.plaint = img;
        }
        onDisable() {
        }
    }

    class UIMain_Houma extends UIMain_Gongzhu {
        createskeleton() {
            this.skeleton = lwg.Sk.houmaTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height - 8;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            let apple = this.self.getChildByName('apple');
            apple.visible = false;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk, true);
        }
        notCommon() {
            this.signSkin = 'Room/icon_plaint.png';
        }
        onTriggerEnter(other, self) {
            if (!lwg.Global._gameStart) {
                return;
            }
            switch (other.label) {
                case 'wall':
                    this.wallAndPerson(other, self);
                    break;
                case 'floor':
                    this.floorAndPerson(other, self);
                    break;
                case 'ladder':
                    this.ladderAndPerson(other, self);
                    break;
                case 'aisle':
                    this.aisleAndPerson(other, self);
                    break;
                default:
                    break;
            }
        }
        move() {
            if (this.attackSwitch) {
                this.rig.setVelocity({ x: 0, y: 0 });
                return;
            }
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.rig.setVelocity({ x: -this.speed, y: 0 });
                this.skeleton.scaleX = -1;
                let apple = this.self.getChildByName('apple');
                apple.x = -2;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.rig.setVelocity({ x: this.speed, y: 0 });
                this.skeleton.scaleX = 1;
                let apple = this.self.getChildByName('apple');
                apple.x = 55;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                this.rig.setVelocity({ x: 0, y: -6 });
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                this.rig.setVelocity({ x: 0, y: 6 });
            }
        }
    }

    class UIMain_Room extends Laya.Script {
        constructor() {
            super();
            this._roomMove = false;
            this.diffX = null;
            this.diffY = null;
        }
        onEnable() {
            this.self = this.owner;
            this.selfScene = this.self.scene;
            this.self['UIMain_Room'] = this;
            this.rig = this.self.getComponent(Laya.RigidBody);
            this.rig.setVelocity({ x: 0, y: 0 });
            this.btnOnClick();
            this.collisionNodeFollow();
        }
        collisionNodeFollow() {
            for (let index = 0; index < this.self.numChildren; index++) {
                const child = this.self.getChildAt(index);
                let rig = child.getComponent(Laya.RigidBody);
                if (rig) {
                    let followScript = child.getComponent(UIMain_Follow);
                    if (!followScript) {
                        child.addComponent(UIMain_Follow);
                    }
                }
            }
        }
        onTriggerEnter(other, self) {
        }
        onTriggerStay() {
        }
        btnOnClick() {
            lwg.Click.on('noEffect', null, this.self, this, this.houseDwon, null, null, null);
        }
        houseDwon() {
            this._roomX = this.self.x;
            this._roomY = this.self.y;
            this._roomMove = true;
            lwg.Global._roomPickup = this.self;
        }
        onStageMouseDown(e) {
            if (!this._stageX && !this._stageY) {
                this._stageX = e.stageX;
                this._stageY = e.stageY;
            }
        }
        onStageMouseMove(e) {
            if (this._roomMove) {
                this.diffX = e.stageX - this._stageX;
                this.diffY = e.stageY - this._stageY;
                this.self.x = this._roomX + this.diffX;
                this.self.y = this._roomY + this.diffY;
            }
        }
        onStageMouseUp() {
            this.selfScene['UIMain'].currentRoom = null;
            this._roomMove = false;
            this._roomX = null;
            this._roomY = null;
            this._stageX = null;
            this._stageY = null;
            this.diffX = null;
            this.diffY = null;
        }
        onUpdate() {
        }
        onDisable() {
        }
    }

    class UIPassHint extends lwg.Admin.Scene {
        adaptive() {
            this.self['sceneContent'].y = Laya.stage.height * 0.481;
        }
        btnOnClick() {
            lwg.Click.on(lwg.Enum.ClickType.largen, null, this.self['BtnYse'], this, null, null, this.btnYseUp, null);
            lwg.Click.on(lwg.Enum.ClickType.largen, null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
        }
        btnYseUp(event) {
            event.currentTarget.scale(1, 1);
            if (this.self['Pic'].skin === 'UI_new/PassHint/word_yes.png') {
                lwg.Admin._openScene('UIDefeated', null, null, null);
            }
            else {
                this.btnYseUp_advFunc();
            }
        }
        btnYseUp_advFunc() {
            this.self['Pic'].skin = 'UI_new/PassHint/word_yes.png';
            let num = lwg.Admin.openCustomName.substring(lwg.Admin.openCustomName.length - 3, lwg.Admin.openCustomName.length);
            this.self['Dec'].text = '  ' + lwg.Global._hintDec[Number(num) - 1]['dec'];
        }
        btnNoUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Admin._openScene('UIDefeated', null, null, null);
        }
    }

    class UIMain_Puase extends lwg.Admin.Scene {
        lwgInit() {
            this.BtnUIStart = this.self['BtnUIStart'];
            this.BtnContinue = this.self['BtnContinue'];
        }
        btnOnClick() {
            lwg.Click.on(lwg.Enum.ClickType.largen, null, this.BtnUIStart, this, null, null, this.BtnUIStartUp, null);
            lwg.Click.on(lwg.Enum.ClickType.largen, null, this.BtnContinue, this, null, null, this.BtnContinueUp, null);
        }
        BtnUIStartUp() {
            lwg.Admin._openScene('UIStart', null, this.self, null);
            lwg.Admin._closeScene(lwg.Global._gameLevel);
        }
        BtnContinueUp() {
            this.self.close();
        }
    }

    class UISet extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            this.self = this.owner;
            this.BtnVoice = this.self['BtnVoice'];
            this.BtnShake = this.self['BtnShake'];
            this.BtnClose = this.self['BtnClose'];
            this.btnVoiceAndBtnShake();
            this.btnClickOn();
        }
        btnVoiceAndBtnShake() {
            let voiceImg = this.BtnVoice.getChildAt(0);
            let voiceUrl1 = 'shezhi/icon_voiceon.png';
            let voiceUrl2 = 'shezhi/icon_voiceoff.png';
            if (lwg.Global._voiceSwitch) {
                voiceImg.skin = voiceUrl1;
            }
            else {
                voiceImg.skin = voiceUrl2;
            }
            let shakeImg = this.BtnShake.getChildAt(0);
            let shakeUrl1 = 'shezhi/shake_on.png';
            let shakeUrl2 = 'shezhi/shake_off.png';
            if (lwg.Global._shakeSwitch) {
                shakeImg.skin = shakeUrl1;
            }
            else {
                shakeImg.skin = shakeUrl2;
            }
        }
        btnClickOn() {
            lwg.Click.on('largen', null, this.BtnVoice, this, null, null, this.btnVoiceClickUP, null);
            lwg.Click.on('largen', null, this.BtnShake, this, null, null, this.btnShakeClickUP, null);
            lwg.Click.on('largen', null, this.BtnClose, this, null, null, this.btnCloseClickUP, null);
        }
        btnVoiceClickUP(event) {
            let voiceImg = this.BtnVoice.getChildAt(0);
            let voiceUrl1 = 'shezhi/icon_voiceon.png';
            let voiceUrl2 = 'shezhi/icon_voiceoff.png';
            if (voiceImg.skin === voiceUrl1) {
                voiceImg.skin = voiceUrl2;
                lwg.Global._voiceSwitch = false;
                lwg.PalyAudio.stopMusic();
            }
            else if (voiceImg.skin === voiceUrl2) {
                voiceImg.skin = voiceUrl1;
                lwg.Global._voiceSwitch = true;
                lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 0);
            }
        }
        btnShakeClickUP(event) {
            event.currentTarget.scale(1, 1);
            let img = this.BtnShake.getChildAt(0);
            let url1 = 'shezhi/shake_on.png';
            let url2 = 'shezhi/shake_off.png';
            if (img.skin === url1) {
                img.skin = url2;
                lwg.Global._shakeSwitch = false;
            }
            else if (img.skin === url2) {
                img.skin = url1;
                lwg.Global._shakeSwitch = true;
            }
        }
        btnCloseClickUP(event) {
            event.currentTarget.scale(1, 1);
            this.self.close();
        }
        onDisable() {
        }
    }

    class UIStart extends lwg.Admin.Scene {
        constructor() {
            super();
            this.moveSwitch = false;
        }
        lwgInit() {
            this.BtnStart = this.self['BtnStart'];
            this.CustomsList = this.self['CustomsList'];
            this.BtnPifu = this.self['BtnPifu'];
            this.BtnPifu.visible = false;
            this.BtnLocation = this.self['BtnLocation'];
            this.BtnLocation.visible = false;
            lwg.Global._createGoldNum(this.self);
            lwg.Global._createExecutionNum(this.self);
            this.createCustomsList();
        }
        createCustomsList() {
            this.CustomsList.selectEnable = false;
            this.CustomsList.vScrollBarSkin = "";
            this.CustomsList.selectHandler = new Laya.Handler(this, this.onSelect_List);
            this.CustomsList.renderHandler = new Laya.Handler(this, this.updateItem);
            this.listFirstIndex = lwg.Global._gameLevel;
            this.refreshListData();
            this.CustomsList.scrollTo(lwg.Global._CustomsNum);
            this.listOpenAni();
        }
        listOpenAni() {
            this.CustomsList.tweenTo(this.listFirstIndex, 100, Laya.Handler.create(this, f => {
                let cell = this.CustomsList.getCell(this.listFirstIndex);
                cell.alpha = 1;
                let pic = cell.getChildByName('pic');
                if (this.listFirstIndex % 2 == 0) {
                    pic.skin = 'UI_new/GameStart/icon_box01_open.png';
                }
                else {
                    pic.skin = 'UI_new/GameStart/icon_box02_open.png';
                }
            }));
        }
        refreshListData() {
            var data = [];
            for (var index = 0; index < lwg.Global._CustomsNum; index++) {
                let customNum = index;
                let picUrl;
                let offsetX;
                if (index % 2 == 0) {
                    picUrl = 'UI_new/GameStart/icon_box01.png';
                    offsetX = 135;
                }
                else {
                    picUrl = 'UI_new/GameStart/icon_box02.png';
                    offsetX = 155;
                }
                let zOder = lwg.Global._CustomsNum - index;
                let lock;
                if (index > lwg.Global._gameLevel) {
                    lock = true;
                }
                else {
                    lock = false;
                }
                data.push({
                    customNum,
                    picUrl,
                    offsetX,
                    zOder,
                    lock
                });
            }
            this.CustomsList.array = data;
        }
        onSelect_List(index) {
        }
        updateItem(cell, index) {
            let dataSource = cell.dataSource;
            cell.zOrder = dataSource.zOder;
            let pic = cell.getChildByName('pic');
            pic.skin = dataSource.picUrl;
            pic.x = dataSource.offsetX;
            let num = pic.getChildByName('LvNum');
            num.value = dataSource.customNum.toString();
            let lock = pic.getChildByName('lock');
            lock.visible = dataSource.lock;
            cell.name = 'item' + dataSource.customNum;
            if (index === this.listFirstIndex) {
                cell.alpha = 0;
            }
            else {
                cell.alpha = 1;
            }
            if (this.listFirstIndex > lwg.Global._gameLevel || this.listFirstIndex < lwg.Global._gameLevel - 3) {
                this.BtnLocation.visible = true;
            }
            else {
                this.BtnLocation.visible = false;
            }
        }
        onStageMouseDown() {
            if (!lwg.Global._stageClick) {
                return;
            }
            this.firstY = Laya.MouseManager.instance.mouseY;
            this.moveSwitch = true;
        }
        onStageMouseUp() {
            let y = Laya.MouseManager.instance.mouseY;
            if (!this.moveSwitch) {
                return;
            }
            let diffY = y - this.firstY;
            if (diffY > 10) {
                this.listFirstIndex -= 1;
                if (this.listFirstIndex < 1) {
                    this.listFirstIndex = 1;
                }
                else {
                    this.createAddHouse();
                }
            }
            else if (diffY < -10) {
                this.listFirstIndex += 1;
                if (this.listFirstIndex > lwg.Global._CustomsNum) {
                    this.listFirstIndex = lwg.Global._CustomsNum;
                }
                else {
                    this.creatSubHouse();
                }
            }
            this.moveSwitch = false;
            this.CustomsList.tweenTo(this.listFirstIndex, 100, Laya.Handler.create(this, f => {
                console.log(this.CustomsList.startIndex);
                console.log(this.listFirstIndex);
            }));
        }
        createAddHouse() {
            let time = 600;
            let house = Laya.Pool.getItemByCreateFun('house', this.house.create, this.house);
            Laya.stage.addChild(house);
            house.pos(this.CustomsList.x - 400, this.CustomsList.y - 300);
            house['UIStart_House'].index = this.listFirstIndex;
            lwg.Animation.move_Simple(house, house.x, house.y, this.CustomsList.x, this.CustomsList.y, time, 0, f => {
                house.removeSelf();
                let cell1 = this.CustomsList.getCell(house['UIStart_House'].index);
                if (cell1) {
                    cell1.alpha = 1;
                    let pic1 = cell1.getChildByName('pic');
                    if (house['UIStart_House'].index % 2 == 0) {
                        pic1.skin = 'UI_new/GameStart/icon_box01_open.png';
                    }
                    else {
                        pic1.skin = 'UI_new/GameStart/icon_box02_open.png';
                    }
                }
                let cell2 = this.CustomsList.getCell(house['UIStart_House'].index + 1);
                if (cell2) {
                    let pic2 = cell2.getChildByName('pic');
                    if ((house['UIStart_House'].index + 1) % 2 === 0) {
                        pic2.skin = 'UI_new/GameStart/icon_box01.png';
                    }
                    else {
                        pic2.skin = 'UI_new/GameStart/icon_box02.png';
                    }
                }
            });
            let pic = house.getChildByName('pic');
            let lvNum = pic.getChildByName('LvNum');
            lvNum.value = this.listFirstIndex.toString();
            if (this.listFirstIndex % 2 == 0) {
                pic.skin = 'UI_new/GameStart/icon_box01_open.png';
                pic.x = 135;
            }
            else {
                pic.skin = 'UI_new/GameStart/icon_box02_open.png';
                pic.x = 155;
            }
            let lock = pic.getChildByName('lock');
            if (this.listFirstIndex > lwg.Global._gameLevel) {
                lock.visible = true;
            }
            else {
                lock.visible = false;
            }
            lwg.Animation.simple_Rotate(pic, 250, 360, time, null);
        }
        creatSubHouse() {
            let cell1 = this.CustomsList.getCell(this.listFirstIndex);
            if (cell1) {
                let pic = cell1.getChildByName('pic');
                if (this.listFirstIndex % 2 == 0) {
                    pic.skin = 'UI_new/GameStart/icon_box01_open.png';
                }
                else {
                    pic.skin = 'UI_new/GameStart/icon_box02_open.png';
                }
            }
            let time = 1000;
            let house = Laya.Pool.getItemByCreateFun('house', this.house.create, this.house);
            Laya.stage.addChild(house);
            house.pos(this.CustomsList.x, this.CustomsList.y);
            lwg.Animation.move_Simple(house, house.x, house.y, this.CustomsList.x + 800, this.CustomsList.y + 500, time, 0, f => {
                house.removeSelf();
            });
            let pic = house.getChildByName('pic');
            let lvNum = pic.getChildByName('LvNum');
            lvNum.value = (this.listFirstIndex - 1).toString();
            if (this.listFirstIndex % 2 == 0) {
                pic.skin = 'UI_new/GameStart/icon_box02_open.png';
            }
            else {
                pic.skin = 'UI_new/GameStart/icon_box01_open.png';
            }
            let lock = pic.getChildByName('lock');
            if (this.listFirstIndex > lwg.Global._gameLevel) {
                lock.visible = true;
            }
            else {
                lock.visible = false;
            }
            lwg.Animation.simple_Rotate(pic, 0, 180, time, null);
        }
        btnOnClick() {
            lwg.Click.on(lwg.Enum.ClickType.largen, null, this.BtnStart, this, null, null, this.btnStartClickUp, null);
            lwg.Click.on(lwg.Enum.ClickType.largen, null, this.BtnPifu, this, null, null, this.btnPifuClickUp, null);
            lwg.Click.on(lwg.Enum.ClickType.noEffect, null, this.BtnLocation, this, null, null, this.btnLocationUp, null);
            lwg.Click.on(lwg.Enum.ClickType.noEffect, null, this.CustomsList, this, null, null, this.customsListUp, null);
        }
        btnStartClickUp(event) {
            event.currentTarget.scale(1, 1);
            let lv = lwg.Global._gameLevel;
            lwg.Global._gameLevel = this.listFirstIndex;
            if (lwg.Global._execution < 2) {
                lwg.Admin._openScene('UIExecutionHint', null, null, null);
            }
            else {
                lwg.Admin._openCustomsScene();
                lwg.Global._execution -= 2;
                lwg.LocalStorage.addData();
                this.self.close();
            }
            lwg.Global._gameLevel = lv;
        }
        btnPifuClickUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._createHint(lwg.Enum.HintType.noPifu);
        }
        btnLocationUp(event) {
            event.currentTarget.scale(1, 1);
            this.listFirstIndex = lwg.Global._gameLevel;
            this.CustomsList.refresh();
            this.createAddHouse();
        }
        cellStyle(cell) {
            let pic = cell.getChildByName('pic');
            if (this.listFirstIndex % 2 == 0) {
                pic.skin = 'UI_new/GameStart/icon_box01_open.png';
            }
            else {
                pic.skin = 'UI_new/GameStart/icon_box02_open.png';
            }
            let lock = pic.getChildByName('lock');
            if (this.listFirstIndex > lwg.Global._gameLevel) {
                lock.visible = true;
            }
            else {
                lock.visible = false;
            }
        }
        customsListUp() {
        }
        onDisable() {
        }
    }

    class UIStart_House extends lwg.Admin.Object {
        constructor() { super(); }
        lwgInit() {
        }
        onDisable() {
        }
    }

    class UIVictory extends lwg.Admin.Scene {
        constructor() { super(); }
        lwgInit() {
            this.BtnGoldAdv = this.self['BtnGoldAdv'];
            this.BtnExAdv = this.self['BtnExAdv'];
            this.GetGold = this.self['GetGold'];
            this.LvNum = this.self['LvNum'];
            this.LvNum.value = lwg.Global._gameLevel.toString();
            this.BtnLast = this.self['BtnLast'];
            lwg.Global._createGoldNum(this.self);
            lwg.Global._createExecutionNum(this.self);
            this.getGoldDisplay();
            this.LvNumDisplay();
            lwg.PalyAudio.playSound(lwg.Enum.voiceUrl.victory, 1);
        }
        adaptive() {
            this.self['sceneContent'].y = Laya.stage.height / 2;
        }
        getGoldDisplay() {
            let getLebel = this.GetGold.getChildByName('Num');
            let level = lwg.Global._gameLevel;
            getLebel.value = 'x' + 25;
            console.log('普通关卡奖励金币为：' + getLebel.value);
        }
        LvNumDisplay() {
            if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                this.LvNum.value = lwg.Global._gameLevel.toString();
            }
            else {
                this.LvNum.value = lwg.Admin.openLevelNum.toString();
            }
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.BtnLast, this, null, null, this.btnLastUp, null);
            lwg.Click.on('largen', null, this.BtnGoldAdv, this, null, null, this.BtnGoldAdvUp, null);
            lwg.Click.on('largen', null, this.BtnExAdv, this, null, null, this.BtnExAdvUp, null);
        }
        btnLastUp() {
            lwg.Admin._closeScene();
            lwg.Admin.openLevelNum++;
            if (lwg.Global._execution < 2) {
                lwg.Admin._openScene('UIExecutionHint', null, null, null);
            }
            else {
                lwg.Global._execution -= 2;
                lwg.LocalStorage.addData();
                if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                    lwg.Global._gameLevel++;
                    lwg.Admin._openCustomsScene();
                }
                else {
                    lwg.Admin._openNumCustomsScene();
                }
            }
            console.log(lwg.Admin.openLevelNum, lwg.Global._gameLevel);
            lwg.Global._goldNum += 25;
            lwg.LocalStorage.addData();
        }
        BtnGoldAdvUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._createHint(lwg.Enum.HintType.noAdv);
        }
        BtnExAdvUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._createHint(lwg.Enum.HintType.noAdv);
        }
        onDisable() {
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/Game/UIDefeated.ts", UIDefeated);
            reg("script/Game/UIExecutionHint.ts", UIExecutionHint);
            reg("script/Game/UILoding.ts", UILoding);
            reg("script/Game/UIMain.ts", UIMain);
            reg("script/Game/UIMain_Aisle.ts", UIMain_Aisle);
            reg("script/Game/UIMain_Dog.ts", Dog);
            reg("script/Game/UIMain_Rival.ts", UIMain_Rival);
            reg("script/Game/UIMain_Bonfire.ts", UIMain_Bonfire);
            reg("script/Game/UIMain_Gongzhu.ts", UIMain_Gongzhu);
            reg("script/Game/UIMain_Wangzi.ts", UIMain_Wangzi);
            reg("script/Game/UIMain_Houzi.ts", UIMain_Houzi);
            reg("script/Game/UIMain_StaticDog.ts", UIMain_StaticDog);
            reg("script/Game/UIMain_Houma.ts", UIMain_Houma);
            reg("script/Game/UIMain_Room.ts", UIMain_Room);
            reg("script/Game/UIPassHint.ts", UIPassHint);
            reg("script/Game/UIMain_Puase.ts", UIMain_Puase);
            reg("script/Game/UISet.ts", UISet);
            reg("script/Game/UIStart.ts", UIStart);
            reg("script/Game/UIStart_House.ts", UIStart_House);
            reg("script/Game/UIVictory.ts", UIVictory);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Scene/UILoding.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = true;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
