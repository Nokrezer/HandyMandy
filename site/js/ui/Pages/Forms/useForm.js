import React, { useState, useEffect } from 'react';
export function useForm(formData) {
    const [values, setValues] = useState(formData);
    function handleChange(event) {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
    }
    return [handleChange, values];
}
