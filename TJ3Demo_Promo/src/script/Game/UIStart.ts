import { lwg, Animation, Effects } from "../Lwg_Template/lwg";
import UIMain from "./UIMain";
import RecordManager from "../../TJ/RecordManager";
import ADManager, { TaT } from "../../TJ/Admanager";
export default class UIStart extends lwg.Admin.Scene {
    /** @prop {name:house,tips:"房子预制体对象",type:Prefab}*/
    house: Laya.Prefab;
    /**开始游戏按钮*/
    BtnStart: Laya.Sprite;
    /**关卡显示位置*/
    AccordingLv: Laya.Sprite;
    /**金币资源*/
    GoldRes: Laya.Sprite;
    /**皮肤按钮*/
    BtnPifu: Laya.Image;
    /**限定皮肤按钮*/
    BtnXianding: Laya.Image;
    /**关卡列表*/
    CustomsList: Laya.List;
    /**回到当前位置按钮*/
    BtnLocation: Laya.Sprite;
    /**list世界坐标*/
    listWPos: Laya.Point = new Laya.Point();
    /**内容集合*/
    SceneContent: Laya.Sprite;

    constructor() { super(); }
    selfVars(): void {
        this.CustomsList = this.self['CustomsList'];
        this.SceneContent = this.self['SceneContent'];
        this.BtnStart = this.self['BtnStart'];
        this.BtnPifu = this.self['BtnPifu'];
        this.BtnLocation = this.self['BtnLocation'];
    }

    lwgInit(): void {
        lwg.Global._stageClick = false;
        ADManager.TAPoint(TaT.BtnShow, 'startbt_main');
        ADManager.TAPoint(TaT.BtnShow, 'CDwall_mainpage');
        ADManager.TAPoint(TaT.BtnShow, 'turn_mainpage');


        this.BtnLocation.visible = false;
        if (lwg.Global._watchAdsNum >= 3) {
            this.self['BtnXD'].removeSelf();
        }
        this.listWPos.x = this.CustomsList.x + this.SceneContent.x - this.SceneContent.width / 2;
        this.listWPos.y = this.CustomsList.y + this.SceneContent.y - this.SceneContent.height / 2;
        this.createCustomsList();
        ADManager.ShowBanner();

        if (!lwg.Global._elect) {
            this.self['P201'].visible = false;
        }
        // 开启多点触控
        Laya.MouseManager.multiTouchEnabled = true;
    }

    adaptive(): void {
        // this.self['P201'].y = Laya.stage.height * 0.156;
        this.SceneContent.y = Laya.stage.height * 0.468;
    }

    openAni(): number {
        let time: number = 80;
        let delayed: number = 100;

        let zhuanpan = this.self['BtnTurntable'].getChildByName('zhuanpan') as Laya.Sprite;
        Animation.drop_KickBack(this.self['BtnTurntable'], 0, -1200, this.self['BtnTurntable'].y, 30, time * 4, 0, f => {
            Laya.timer.frameLoop(1, this, f => {
                zhuanpan.rotation++;
            });
        });

        let dan = this.self['BtnPainted'].getChildByName('dan');
        Animation.drop_KickBack(this.self['BtnPainted'], 0, -1200, this.self['BtnPainted'].y, 30, time * 4, delayed * 2, f => {
            Laya.timer.loop(3000, this, f => {
                Animation.shookHead_Simple(dan, 10, time * 3, 0, f => { });
            });
            Laya.timer.loop(1500, this, f => {
                let scope = 20;
                let ranX;
                if (Math.floor(Math.random() * 2) === 1) {
                    ranX = this.self['BtnPainted'].width / 2 + Math.random() * scope;
                } else {
                    ranX = this.self['BtnPainted'].width / 2 - Math.random() * scope;
                }
                let ranY;
                if (Math.floor(Math.random() * 2) === 1) {
                    ranY = this.self['BtnPainted'].height / 2 + Math.random() * scope - 25;
                } else {
                    ranY = this.self['BtnPainted'].height / 2 - Math.random() * scope - 25;
                }
                Effects.createExplosion_Rotate(this.self['BtnPainted'], 10, ranX, ranY, 'star', 3, 15);
            });
        });

        Animation.drop_KickBack(this.self['BtnPifu'], 0, -1200, this.self['BtnPifu'].y, 30, time * 4, delayed * 3, f => { });

        //皮肤限定盖章动画
        if (this.self['BtnXD'].visible) {
            let wordXd = this.self['BtnXD'].getChildByName('wordXd') as Laya.Sprite;
            let wordXd_01 = this.self['BtnXD'].getChildByName('wordXd_01') as Laya.Sprite;
            wordXd_01.alpha = 0;
            wordXd.alpha = 0;
            Animation.drop_KickBack(this.self['BtnXD'], 0, -1200, this.self['BtnXD'].y, 30, time * 4, delayed * 1, f => {
                wordXd.alpha = 1;
                lwg.Animation.move_Scale(wordXd, 1, 200, 75, 99, 59, 2, time * 3, 200, f => {
                    lwg.Animation.move_Scale(wordXd, wordXd.scaleX, wordXd.x, wordXd.y, 68, 73, 1, time * 0.7, 0, f => {
                        wordXd.removeSelf();
                        wordXd_01.alpha = 1;
                        lwg.Animation.rotate_Scale(this.self['BtnXD'], 0, 1, 1, 0, 0.88, 0.88, time * 1.2, 0, f => {
                            lwg.Global._stageClick = true;
                        });

                        if (!lwg.Global._todayCheckIn) {
                            lwg.Global._todayCheckIn = true;
                            lwg.Admin._openScene(lwg.Admin.SceneName.UICheckIn, null, null, null);
                        }
                    })
                })
            });
        }

        Animation.bombs_Appear(this.BtnStart, 0, 1, 1.1, 0, time * 3, time, delayed, null, f => {
            Animation.swell_shrink(this.BtnStart, 1, 1.1, time * 1.5, delayed, f => {
                Laya.timer.loop(3000, this, f => {
                    Animation.swell_shrink(this.BtnStart, 1, 1.1, time * 1.5, delayed, f => {
                    });
                });
            });
        });
        Animation.blink_FadeOut(lwg.Global.ExecutionNumNode, 0, 1, time * 5, delayed * 2, f => {
        });
        Animation.blink_FadeOut(lwg.Global.GoldNumNode, 0, 1, time * 5, delayed * 2, f => {
        });
        return time * 5;
    }
    /**限定皮肤的单独效果*/


    /**创建关卡list*/
    createCustomsList(): void {
        this.CustomsList.selectEnable = false;
        this.CustomsList.vScrollBarSkin = "";
        // this.CustomsList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
        // this.CustomsList.scrollBar.elasticDistance = 0;//设置橡皮筋极限距离。
        this.CustomsList.selectHandler = new Laya.Handler(this, this.onSelect_List);
        this.CustomsList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.listFirstIndex = lwg.Global._gameLevel;
        this.refreshListData();
        this.listOpenAni();
    }

    /**
      * list列表出场动画
      * 规则是从第一关到当前的关卡
      * */
    listOpenAni(): void {
        this.CustomsList.scrollTo(lwg.Global._CustomsNum);
        this.CustomsList.tweenTo(this.listFirstIndex, 600, Laya.Handler.create(this, f => {
            let cell = this.CustomsList.getCell(this.listFirstIndex);
            cell.alpha = 1;
            let pic = cell.getChildByName('pic') as Laya.Image;
            if (this.listFirstIndex % 2 == 0) {
                pic.skin = 'UI_new/GameStart/icon_box01_open.png';
            } else {
                pic.skin = 'UI_new/GameStart/icon_box02_open.png';
            }
        }));
    }

    /**
     * 刷新list列表数据,如果需要更新list列表数据，更新此方法即可
     * */
    refreshListData(): void {
        var data: Array<Object> = [];
        // 反向显示，列表上的数字是自上而下的，现在改为自下而上
        for (var index: number = 0; index < lwg.Global._CustomsNum; index++) {
            let customNum = index;
            // 图片变换
            let picUrl;
            // x轴的错开距离
            let offsetX;
            if (index % 2 == 0) {
                picUrl = 'UI_new/GameStart/icon_box01.png';
                offsetX = 135;
            } else {
                picUrl = 'UI_new/GameStart/icon_box02.png';
                offsetX = 155;
            }
            // 层级
            let zOder = lwg.Global._CustomsNum - index;
            // 表示是否解锁
            let lock;
            if (index >= lwg.Global._gameLevel) {
                lock = false;
            } else {
                lock = true;
            }
            data.push({
                customNum,
                picUrl,
                offsetX,
                zOder,
                lock
            });
        }
        // 重制array信息列表
        this.CustomsList.array = data;
    }

    /**当前触摸的box监听*/
    onSelect_List(index: number): void {
        // console.log("当前选择的索引：" + index);
    }

    /**信息刷新，只用listData里面的信息进行赋值，不用其他外部信息进行赋值*/
    updateItem(cell: Laya.Box, index: number): void {
        let dataSource = cell.dataSource;
        cell.zOrder = dataSource.zOder;

        let pic = cell.getChildByName('pic') as Laya.Image;
        pic.skin = dataSource.picUrl;
        pic.x = dataSource.offsetX;

        let num = pic.getChildByName('LvNum') as Laya.FontClip;
        num.value = dataSource.customNum.toString();

        let lock = pic.getChildByName('lock') as Laya.Image;
        lock.visible = dataSource.lock;

        cell.name = 'item' + dataSource.customNum;
        // console.log(cell);
        // 第一个上面的那个单元总是隐藏起来，手动显示
        if (index === this.listFirstIndex) {
            cell.alpha = 0;
        } else {
            cell.alpha = 1;
        }
        // 当前位置如果看不到了，那么出现回到当前位置按钮
        // let index01 = this.CustomsList.startIndex;
        if (this.listFirstIndex > lwg.Global._gameLevel || this.listFirstIndex < lwg.Global._gameLevel - 3) {
            this.BtnLocation.visible = true;
        } else {
            this.BtnLocation.visible = false;
        }
    }

    /**滑动设置，滑动一段，走一格*/
    private moveSwitch: boolean = false;
    private firstY: number;
    /**list列表第一个第几个单元，因为0位置是空位，所以标记从1开始，而不是0置*/
    private listFirstIndex: number;
    onStageMouseDown(e: Laya.Event) {
        if (!lwg.Global._stageClick || lwg.Global._openXD) {
            return;
        }
        // console.log('点击了舞台！');
        this.firstY = Laya.MouseManager.instance.mouseY;
        this.moveSwitch = true;
    }
    onStageMouseUp(): void {
        let y = Laya.MouseManager.instance.mouseY;
        if (!this.moveSwitch) {
            return;
        }
        let diffY = y - this.firstY;

        if (diffY > 10) {
            // console.log('向下滑动');
            // 隐藏上面的那个盒子，创建新的房子后，在显现
            this.listFirstIndex -= 1;
            // 设置最小值
            if (this.listFirstIndex < 1) {
                this.listFirstIndex = 1;
            } else {
                this.createAddHouse();
            }
        } else if (diffY < -10) {
            // console.log('向上滑动');
            this.listFirstIndex += 1;
            // 设置最大值
            if (this.listFirstIndex > lwg.Global._CustomsNum) {
                this.listFirstIndex = lwg.Global._CustomsNum;
            } else {
                this.creatSubHouse();
            }
        }
        this.moveSwitch = false;
        this.CustomsList.tweenTo(this.listFirstIndex, 100, Laya.Handler.create(this, f => { }));
    }

    /**创建一个增加房子的动画*/
    createAddHouse(): void {
        let time = 600;
        let house = Laya.Pool.getItemByCreateFun('house', this.house.create, this.house) as Laya.Sprite;
        this.SceneContent.addChild(house);
        house.pos(this.CustomsList.x - 400, this.CustomsList.y - 300);

        // 锁定这个房子在list中的索引值
        // console.log(house['UIStart_House']);
        house['UIStart_House'].index = this.listFirstIndex;
        lwg.Animation.move_Simple(house, house.x, house.y, this.CustomsList.x, this.CustomsList.y, time, 0, f => {
            house.removeSelf();
            // 最上面的房间为打开样式，并且显示
            let cell1 = this.CustomsList.getCell(house['UIStart_House'].index);
            if (cell1) {
                cell1.alpha = 1;
                let pic1 = cell1.getChildByName('pic') as Laya.Image;
                if (house['UIStart_House'].index <= lwg.Global._gameLevel) {
                    if (house['UIStart_House'].index % 2 == 0) {
                        pic1.skin = 'UI_new/GameStart/icon_box01_open.png';
                    } else {
                        pic1.skin = 'UI_new/GameStart/icon_box02_open.png';
                    }
                } else {
                    if (house['UIStart_House'].index % 2 == 0) {
                        pic1.skin = 'UI_new/GameStart/icon_box01.png';
                    } else {
                        pic1.skin = 'UI_new/GameStart/icon_box02.png';
                    }
                }
            }

            // 改变其下一个单元的样式，为关闭样式
            let cell2 = this.CustomsList.getCell(house['UIStart_House'].index + 1);
            if (cell2) {
                let pic2 = cell2.getChildByName('pic') as Laya.Image;
                if ((house['UIStart_House'].index + 1) % 2 === 0) {
                    pic2.skin = 'UI_new/GameStart/icon_box01.png';
                } else {
                    pic2.skin = 'UI_new/GameStart/icon_box02.png';
                }
            }
        });
        // 房子本身不动，里面的图片旋转和移动
        let pic = house.getChildByName('pic') as Laya.Image;
        let lvNum = pic.getChildByName('LvNum') as Laya.FontClip;
        lvNum.value = this.listFirstIndex.toString();
        if (this.listFirstIndex <= lwg.Global._gameLevel) {
            if (this.listFirstIndex % 2 == 0) {
                pic.skin = 'UI_new/GameStart/icon_box01_open.png';
                pic.x = 135;
            } else {
                pic.skin = 'UI_new/GameStart/icon_box02_open.png';
                pic.x = 155;
            }
        } else {
            if (this.listFirstIndex % 2 == 0) {
                pic.skin = 'UI_new/GameStart/icon_box01.png';
                pic.x = 135;
            } else {
                pic.skin = 'UI_new/GameStart/icon_box02.png';
                pic.x = 155;
            }
        }

        let lock = pic.getChildByName('lock') as Laya.Image;
        if (this.listFirstIndex >= lwg.Global._gameLevel) {
            lock.visible = false;
        } else {
            lock.visible = true;
        }
        lwg.Animation.simple_Rotate(pic, 250, 360, time, null);
    }

    /**创建一个减少房子的动画*/
    creatSubHouse(): void {
        // 设置当前第一个为打开状态
        let cell1 = this.CustomsList.getCell(this.listFirstIndex);
        if (cell1) {
            let pic = cell1.getChildByName('pic') as Laya.Image;
            if (this.listFirstIndex <= lwg.Global._gameLevel) {
                if (this.listFirstIndex % 2 == 0) {
                    pic.skin = 'UI_new/GameStart/icon_box01_open.png';
                    pic.x = 135;
                } else {
                    pic.skin = 'UI_new/GameStart/icon_box02_open.png';
                    pic.x = 155;
                }
            } else {
                if (this.listFirstIndex % 2 == 0) {
                    pic.skin = 'UI_new/GameStart/icon_box01.png';
                    pic.x = 135;
                } else {
                    pic.skin = 'UI_new/GameStart/icon_box02.png';
                    pic.x = 155;
                }
            }
        }
        let time = 1000;
        let house = Laya.Pool.getItemByCreateFun('house', this.house.create, this.house) as Laya.Sprite;
        this.SceneContent.addChild(house);
        house.pos(this.CustomsList.x, this.CustomsList.y);
        lwg.Animation.move_Simple(house, house.x, house.y, this.CustomsList.x + 800, this.CustomsList.y + 500, time, 0, f => {
            house.removeSelf();
        });
        let pic = house.getChildByName('pic') as Laya.Image;
        let lvNum = pic.getChildByName('LvNum') as Laya.FontClip;
        lvNum.value = (this.listFirstIndex - 1).toString();
        if (this.listFirstIndex <= lwg.Global._gameLevel) {
            if (this.listFirstIndex % 2 == 0) {
                pic.skin = 'UI_new/GameStart/icon_box01_open.png';
                pic.x = 135;
            } else {
                pic.skin = 'UI_new/GameStart/icon_box02_open.png';
                pic.x = 155;
            }
        } else {
            if (this.listFirstIndex % 2 == 0) {
                pic.skin = 'UI_new/GameStart/icon_box01.png';
                pic.x = 135;
            } else {
                pic.skin = 'UI_new/GameStart/icon_box02.png';
                pic.x = 155;
            }
        }
        let lock = pic.getChildByName('lock') as Laya.Image;
        if (this.listFirstIndex >= lwg.Global._gameLevel) {
            lock.visible = false;
        } else {
            lock.visible = true;
        }
        lwg.Animation.simple_Rotate(pic, 0, 180, time, null);
    }

    btnOnClick(): void {

        lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnStart, this, null, null, this.btnStartClickUp, null);

        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.BtnLocation, this, null, null, this.btnLocationUp, null);
        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.CustomsList, this, null, null, this.customsListUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnXD'], this, null, null, this.btnXDUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnSet'], this, null, null, this.btnSetUp, null);


        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnPainted'], this, this.btnPaintedDown, null, this.btnPaintedUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnPifu, this, this.btnPifuDown, null, this.btnPifuUp, null);


        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnTurntable'], this, null, null, this.btnTurntableUp, null);

    }

    /**彩蛋按钮相关*/
    btnPainted = false;
    btnPaintedDown(e: Laya.Event): void {
        e.stopPropagation();
        if (lwg.Global._haimiangongzhu) {
            return;
        }
        e.currentTarget.scale(1.1, 1.1);
        this.btnPainted = true;
    }
    btnPaintedUp(e): void {
        ADManager.TAPoint(TaT.BtnClick, 'CDwall_mainpage');

        e.currentTarget.scale(1, 1);
        if (!this.candanFunc()) {
            lwg.Admin._openScene(lwg.Admin.SceneName.UICaiDanQiang, null, null, null);
        }
        this.btnPainted = false;
        this.btnPifu = false;
    }

    /**皮肤按钮相关*/
    btnPifu: boolean = false;
    btnPifuDown(e: Laya.Event): void {
        e.stopPropagation();
        if (lwg.Global._haimiangongzhu) {
            return;
        }
        e.currentTarget.scale(1.1, 1.1);
        this.btnPifu = true;
    }

    btnPifuUp(event): void {
        event.currentTarget.scale(1, 1);
        if (!this.candanFunc()) {
            lwg.Admin._openScene('UIPifu', null, null, null);
        }
        this.btnPainted = false;
        this.btnPifu = false;
    }

    candanFunc(): boolean {
        if (this.btnPainted && this.btnPifu) {
            // lwg.Global._createHint_InPut('btnPainted: ' + this.btnPainted.toString() + '   ' + 'btnTurntable: ' + this.btnPifu.toString());
            lwg.Admin._openScene(lwg.Admin.SceneName.UICaidanPifu, null, null, f => {
                this.btnPainted = false;
                this.btnPifu = false;
            });
            return true;
        } else {
            return false;
        }
    }

    btnTurntableUp(e): void {
        e.currentTarget.scale(1, 1);
        lwg.Admin._openScene(lwg.Admin.SceneName.UITurntable, null, null, null);

        ADManager.TAPoint(TaT.BtnClick, 'turn_mainpage');

    }

    btnSetUp(): void {
        lwg.Admin._openScene(lwg.Admin.SceneName.UISet, null, null, null);
    }

    btnXDUp(): void {
        lwg.Admin._openScene(lwg.Admin.SceneName.UIXDpifu, null, null, null);
    }

    btnStartClickUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'startbt_main');

        event.currentTarget.scale(1, 1);
        // 如果选中的關卡大于當前關卡則提示未過關，打开选中关卡
        if (this.listFirstIndex > lwg.Global._gameLevel) {
            lwg.Global._createHint_01(lwg.Enum.HintType.nopass);
        } else {
            if (lwg.Global._execution < 2) {
                lwg.Admin._openScene('UIExecutionHint', null, null, null);
            } else {
                if (lwg.Global._havePifu.length < 7) {
                    // 格式
                    if (this.listFirstIndex <= 9) {
                        lwg.Admin.openCustomName = 'UIMain_00' + this.listFirstIndex;
                    } else if (9 < this.listFirstIndex || this.listFirstIndex <= 99) {
                        lwg.Admin.openCustomName = 'UIMain_0' + this.listFirstIndex;
                    }
                    lwg.Admin.openLevelNum = this.listFirstIndex;
                    lwg.Admin._openScene(lwg.Admin.SceneName.UIPifuTry, null, null, null);
                } else {
                    // console.log(this.listFirstIndex);
                    this.openPlayScene();
                }
            }
        }
    }

    /**打开游戏场景*/
    openPlayScene(): void {
        lwg.Global._execution -= 2;
        let num = lwg.Global.ExecutionNumNode.getChildByName('Num') as Laya.FontClip;
        num.value = lwg.Global._execution.toString();
        lwg.Global._createHint_01(lwg.Enum.HintType.consumeEx);
        lwg.Global.createConsumeEx(null);

        lwg.LocalStorage.addData();

        lwg.Admin._openNumCustom(this.listFirstIndex);

        this.self.close();
    }
    /**免除体力打开游戏场景*/
    openPlayScene_exemptEx(): void {
        lwg.Admin._openNumCustom(this.listFirstIndex);
        this.self.close();
    }


    btnLocationUp(event): void {
        event.currentTarget.scale(1, 1);
        this.listFirstIndex = lwg.Global._gameLevel;
        this.CustomsList.refresh();
        this.createAddHouse();
    }

    /**通用图片样式的替换*/
    cellStyle(cell): void {
        let pic = cell.getChildByName('pic') as Laya.Image;
        if (this.listFirstIndex % 2 == 0) {
            pic.skin = 'UI_new/GameStart/icon_box01_open.png';
        } else {
            pic.skin = 'UI_new/GameStart/icon_box02_open.png';
        }

        let lock = pic.getChildByName('lock') as Laya.Image;
        if (this.listFirstIndex > lwg.Global._gameLevel) {
            lock.visible = true;
        } else {
            lock.visible = false;
        }
    }

    customsListUp(): void {
        // this.BtnLocation.visible = false;
    }

    lwgDisable() {
        ADManager.CloseBanner();
        // 关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;
    }
}