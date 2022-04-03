'use strict';

class ObjectBase
{
    constructor()
    {
        
    }

    toJson = (obj) =>
    {   
        let o ;

        if (Array.isArray(obj)) o = [];
        if (!Array.isArray(obj)) o = {};
     
        if (obj == null) obj = this;

        for (let kv of Object.entries(obj))
        {
            let key = kv[0], value = kv[1]; 

            if (typeof value != "function") 
            {
                if (typeof value == "object")
                {
                    o[key] = this.toJson(value);
                }
                else
                {
                    o[key] = value;
                }
            }
        }

        return o;
    }
}

class CheckSheetViewElement
{
    constructor(obj)
    {
        if (obj["SourceSheet"] != null) this.SourceSheet = obj["SourceSheet"];

        if (obj["ViewElement"] != null)
        {
            const el = obj["ViewElement"];

            this.ViewElement = el;

            this.SheetElement = 
            $("<ul></ul>",
            {
                "class": "list-group"
            })
            .appendTo($(el));

            $(el).append(
            $(`
                <div class="d-grid gap-2">
                    <input class="btn btn-outline-primary" value="項目を追加" type="button" data-bs-toggle="modal" data-bs-target="#d">
                </div>

                ${ this.PreferenceItemModal( { id: "d" } ) }
            `));

            $("#button_append_item").on("click", this.Click_Append);
        }

        this.InputTypes = 
        {
            "": CheckSheetItem,
            "Input": CheckSheetItemInput,
            "Check": CheckSheetItemCheckBox,
            "Radio": CheckSheetItemRadio,
        }
    }



    Click_Append = () =>
    {
        const type_str = $("[name='inputType']").val();

        const gen_item = 
        this.SourceSheet.AppendItem(
        this.InputTypes[type_str], 
        {
            Caption: $("[name='inputCaption']").val(),

        }).GenerateElement();

        $(this.SheetElement).append(gen_item);

        // $(this.ViewElement).append(gen_item);
    }

    PreferenceItemModal = (pref) =>
    {
        return `
            <div class="modal fade" id=${pref.id} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
            <form  class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">チェック項目の設定</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="form-floating mb-3">
                        <input name="inputCaption" class="form-control" placeholder="チェック1" value="" />
                        <label class="form-label">キャプション</label>
                    </div>

                    <div class="form-floating mb-3">
                        <select name="inputType" class="form-select" aria-label="入力タイプ">
                            <option value="Input">テキスト入力</option>
                            <option value="Check">チェックボックス</option>
                            <option value="Radio">ラジオボタン</option>
                        </select>
                        <label class="form-label">入力タイプ</label>
                    </div>

                    <div class="mb-3">                        
                        <input class="form-check-input" type="checkbox" id="check_isrequired" />
                        <label class="form-check-label" for="check_isrequired">必須入力</label>
                    </div>

                    <div class="mb-3">                        
                        <input class="form-check-input" type="checkbox" id="check_reverse" />
                        <label class="form-check-label" for="check_reverse">チェック時の有効化を反転する</label>
                    </div>

                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="button_append_item" data-bs-dismiss="modal">追加</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                </div>
            </form >
            </div>
        </div>
        `;
    }
}

class CheckSheet extends ObjectBase
{
    constructor()
    {
        super();


        this.Items = [];

    }

    LoadFromJsonString = (src) =>
    {             
        let c = new CheckSheetItemInput();

        c.Caption = "Test";    
        this.Items.push(c);


        console.log(this.toJson());    
    }

    AppendItem = (type, item_prop) =>
    {
        const new_item = new type();

        for (const prop of Object.entries(item_prop))
        {
            const key = prop[0], value = prop[1];
            new_item[key] = value;
        }

        this.Items.push(new_item);

        return new_item;
    }
}

class CheckSheetItem extends ObjectBase
{
    constructor()
    {
        super();

        this.Name = "キャプション";
        this.Caption = "キャプション";
        this.Children = [];
        this.IsRequired = true;
    }

    GetType = () => "";

    GenerateElement = () =>
    {

    }

    GenerateSettingButton = () =>
    {
        return $(`<input />`,
        {
            type: "button",
            value: "設定",
            id: `${this.Name}`,
            class: "btn btn-outline-secondary" 
        }).on("click", () =>
        {
            alert("AAAAAAA");
        });
    }
}

class CheckSheetItemInput extends CheckSheetItem
{
    constructor()
    {
        super();
        this.Type = this.GetType();
    }

    GetType = () => "Input";

    GenerateElement = () =>
    {
        const li = $(`<li></li>`, 
        {
            class: "input-group"
        })

        const group = $("<div></div>",
        {
            class: "form-floating  mb-3"
        }).appendTo(li);

        group.append($(`<input />`,
        {
            class: "form-control",
            placeholder: this.Caption,
        }));

        group.append($("<label></label>",
        {
            class: "form-label",

        }).text(this.Caption));

        li.append(this.GenerateSettingButton());

        return li;
    }
}

class CheckSheetItemCheckBox extends CheckSheetItem
{
    constructor()
    {
        super();
        this.Type = this.GetType();
    }

    GetType = () => "CheckBox";

    GenerateElement = () =>
    {
        
    }
}

class CheckSheetItemRadio extends CheckSheetItem
{
    constructor()
    {
        super();
        this.Type = this.GetType();
    }

    GetType = () => "Radio";

    GenerateElement = () =>
    {
        
    }
}

