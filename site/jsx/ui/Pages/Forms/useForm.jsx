import React, {useState, useEffect} from 'react';

export function useForm(formData)//Общий метод для форм входа и регистрации
{
    const [values, setValues] = useState(formData);

    function handleChange(event)//При вводе данных(текстовые поля) изменяем значения
    {
        const { name, value } = event.target;
        setValues(prev => ({...prev, [name]: value}));
    }

    return [handleChange, values];
}