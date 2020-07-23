import { lwg, Animation, Click, EventAdmin } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";
import RecordManager from "../../TJ/RecordManager";

export default class UIAdvertising extends lwg.Admin.Scene {
    /**中间内容*/
    SceneContent: Laya.Sprite;
    /**星星特效节点*/
    Star: Laya.Sprite;

    selfVars(): void {
        this.SceneContent = this.self['SceneContent'];
        this.Star = this.self['Star']
    }
    adaptive(): void {
        this.SceneContent.y = Laya.stage.height / 2;
    }

    lwgInit(): void {

    }

    btnOnClick(): void {
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['background'], this, null, null, this.backgroundUp, null);
    }

    backgroundUp(): void {
        console.log('防止穿透！');
    }

    openAni(): number {
        this.aniTime = 100;
        this.aniDelayde = 100;
        Animation.scale_Alpha(this.SceneContent, 0, 0, 0, 1, 1, 1, this.aniTime * 5, this.aniDelayde * 0, f => {
            Laya.timer.once(this.aniTime * 15, this, () => {
                Animation.scale_Alpha(this.SceneContent, 1, 1, 1, 0, 0, 0, this.aniTime * 2, this.aniDelayde * 0, f => {
                    //   ['UIMain'].createHuliRoom();
                    this.self.close();
                });
            });
        });

        for (let index = 0; index < this.Star.numChildren; index++) {
            const element = this.Star.getChildAt(index);
            Animation.blink_FadeOut(element, 0, 1, this.aniTime * 5, Math.random() * 3 * this.aniDelayde, () => {
                Animation.blink_FadeOut(element, Math.random() * 0.3 + 0.2, 1, this.aniTime * 3, Math.random() * 3 * 0, () => {
                    Animation.blink_FadeOut(element, Math.random() * 0.3 + 0.2, 1, this.aniTime * 3, Math.random() * 3 * 0, () => {
                        Animation.blink_FadeOut(element, Math.random() * 0.3 + 0.2, 1, this.aniTime * 3, Math.random() * 3 * 0, () => {

                        })
                    })
                })
            })
        }

        // Animation.simple_Rotate(this.SceneContent, 0, 360, this.aniTime * 3, () => { });

        return 100;
    }

    lwgDisable(): void {
        EventAdmin.notify(EventAdmin.EventType.advertising)
    }

}