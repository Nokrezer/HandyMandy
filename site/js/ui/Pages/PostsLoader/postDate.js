import { MONTHS_CODES } from "../../../settings/config.js";
export function PostDate({ post }) {
    const year = new Date().getFullYear(); //Получаем год который сейчас
    const fullDate = post.created.split(" "); //Получаем дату
    const shortMonth = fullDate[2]; //Короткое название месяца на английском
    const monthCode = MONTHS_CODES[shortMonth]; //Получаем код месяца(по порядку, по индексу)
    const date = new Date(2000, monthCode, 1); //Создаём дату(год и число неважно)
    let day = parseInt(fullDate[1]); //получаем день
    const resultMonth = date.toLocaleDateString("ru", { month: 'short' }); //Получаем месяц на нужном языке(русский)
    return `${day} ${resultMonth.slice(0, resultMonth.length - 1)} ${year === parseInt(fullDate[3]) ? '' : fullDate[3]}`;
}
