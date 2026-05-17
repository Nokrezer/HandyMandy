export function CheckData(form_data)
{
    for(let key in form_data)
    {
        if(form_data[key] == '' || form_data[key] == null)
        {
            throw new Error("Все поля должны быть заполнены! " + key);
        }
    }

    if("email" in form_data && !form_data.email.includes("@")) throw new Error("Некоректный почтовый адрес");
    if("email" in form_data && !form_data.email.includes(".ru")) throw new Error("Регистрация производиться только с русскими адресами почты");
}