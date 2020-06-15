import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_Bonfire extends lwg.Admin.Object {
    ani: Laya.Image;
    time: number;
    lwgInit(): void {
        this.ani = this.self.getChildByName('ani') as Laya.Image;
        this.time = 0;
    }
    onUpdate(): void {
        this.time++;
        let url1 = 'Room/ani_fire_01.png';
        let url2 = 'Room/ani_fire_02.png';
        let url3 = 'Room/ani_fire_03.png';
        let speed = 5;
        if (this.time % (speed * 3) === 0) {
            this.ani.skin = url3;
        } else if (this.time % (speed * 2) === 0) {
            this.ani.skin = url2;
        } else if (this.time % speed === 0) {
            this.ani.skin = url1;
        }
    }
}