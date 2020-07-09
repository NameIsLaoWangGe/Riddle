export default class CaiDanData 
{
    ID: number;
    IconPath: string;
    IconPath_h: string;
    Name: string;
    Info: string;
    MesLiayuan: string;
    MesFangshi: string;
    Tip:string;

    
    GetIconPath()
    {
        this.IconPath = "CaiDanQIang/Skin/" + this.ID + ".png"
        return this.IconPath
    }

    GetIconPath_h()
    {
        this.IconPath_h = "CaiDanQIang/Skin/" + this.ID + "_01.png"
        return this.IconPath_h
    }


}