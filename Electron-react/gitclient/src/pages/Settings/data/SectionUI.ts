export enum SectionUIItemType {
    Group = 0,
    CheckBox = 1, // 选择
    Input = 2, // 输入
    
}

export interface SectionItem {
    title: string;
    showStatus: number; // 0为显示，1为正在显示，2为隐藏，3为正在隐藏
    sub: SectionSubItem[];
}

export interface SectionSubItem {
    type: SectionUIItemType;

    isSelected: boolean;
    content: string;
    desc: string|undefined;

    tipsContent: string|undefined;
    tipsShow: string;

    inputType: SectionSubItemInputType;
    inputContent: string;

    chooseIndex: number;
    chooseList: SectionSubItemChooseItem[];

    sub: SectionSubItem[];
}

export enum SectionSubItemInputType {
    Number = 0,
    String = 1,
}

export interface SectionSubItemChooseItem {

}