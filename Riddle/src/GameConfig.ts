/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import UIDefeated from "./script/Game/UIDefeated"
import UIExecutionHint from "./script/Game/UIExecutionHint"
import UILoding from "./script/Game/UILoding"
import UIMain from "./script/Game/UIMain"
import UIMain_Aisle from "./script/Game/UIMain_Aisle"
import UIMain_Dog from "./script/Game/UIMain_Dog"
import UIMain_Rival from "./script/Game/UIMain_Rival"
import UIMain_Bonfire from "./script/Game/UIMain_Bonfire"
import UIMain_Gongzhu from "./script/Game/UIMain_Gongzhu"
import UIMain_Wangzi from "./script/Game/UIMain_Wangzi"
import UIMain_Houzi from "./script/Game/UIMain_Houzi"
import UIMain_StaticDog from "./script/Game/UIMain_StaticDog"
import UIMain_Houma from "./script/Game/UIMain_Houma"
import UIMain_Room from "./script/Game/UIMain_Room"
import UIPassHint from "./script/Game/UIPassHint"
import UIMain_Puase from "./script/Game/UIMain_Puase"
import UISet from "./script/Game/UISet"
import UIStart from "./script/Game/UIStart"
import UIStart_House from "./script/Game/UIStart_House"
import UIVictory from "./script/Game/UIVictory"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=720;
    static height:number=1280;
    static scaleMode:string="fixedwidth";
    static screenMode:string="vertical";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="Scene/UILoding.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=true;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/Game/UIDefeated.ts",UIDefeated);
        reg("script/Game/UIExecutionHint.ts",UIExecutionHint);
        reg("script/Game/UILoding.ts",UILoding);
        reg("script/Game/UIMain.ts",UIMain);
        reg("script/Game/UIMain_Aisle.ts",UIMain_Aisle);
        reg("script/Game/UIMain_Dog.ts",UIMain_Dog);
        reg("script/Game/UIMain_Rival.ts",UIMain_Rival);
        reg("script/Game/UIMain_Bonfire.ts",UIMain_Bonfire);
        reg("script/Game/UIMain_Gongzhu.ts",UIMain_Gongzhu);
        reg("script/Game/UIMain_Wangzi.ts",UIMain_Wangzi);
        reg("script/Game/UIMain_Houzi.ts",UIMain_Houzi);
        reg("script/Game/UIMain_StaticDog.ts",UIMain_StaticDog);
        reg("script/Game/UIMain_Houma.ts",UIMain_Houma);
        reg("script/Game/UIMain_Room.ts",UIMain_Room);
        reg("script/Game/UIPassHint.ts",UIPassHint);
        reg("script/Game/UIMain_Puase.ts",UIMain_Puase);
        reg("script/Game/UISet.ts",UISet);
        reg("script/Game/UIStart.ts",UIStart);
        reg("script/Game/UIStart_House.ts",UIStart_House);
        reg("script/Game/UIVictory.ts",UIVictory);
    }
}
GameConfig.init();