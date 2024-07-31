import React, { useState, useRef, useEffect } from 'react';

const AutocompleteMine = ({ items, handleDetailChange, index, newRegister, errors }) => {
    const [filteredItems, setFilteredItems] = useState(items);
    const [inputValue, setInputValue] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        if (items.length > 0) {
            const selectedItem = items.find(item => item.codigo === newRegister.details[index].element_id);
            if (selectedItem) {
                setInputValue(`${selectedItem.codigo} ${selectedItem.name}`);
            }
        }
    }, [index, items, newRegister.details]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        const filtered = items.filter(item => {
            const terms = value.toLowerCase().split(' ');
            return terms.every(term =>
                item.name.toLowerCase().includes(term) ||
                item.codigo.toString().toLowerCase().includes(term)
            );
        });
        setFilteredItems(filtered);
        setIsDropdownVisible(true);
    };

    const handleSelect = (value, inValue) => {
        handleDetailChange(index, 'element_id', parseInt(value));
        setInputValue(inValue);
        setIsDropdownVisible(false);
    };

    const handleClickOutside = (e) => {
        if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
            setIsDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div ref={autocompleteRef}>
            <div className={`relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium items-start transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background h-14 py-2  cursor-text focus-within:hover:bg-default-100 group-data-[invalid=true]:bg-danger-50 group-data-[invalid=true]:hover:bg-danger-100 group-data-[invalid=true]:focus-within:hover:bg-danger-50 flex-col  justify-center gap-0 ${errors.element_id ? 'bg-[#fee7ef] hover:bg-[#fdd0df]' : 'bg-default-100 hover:bg-default-200 '}`}>
                <label htmlFor="autocomplete-elements" className="block subpixel-antialiased text-default-600 group-data-[required=true]:after:content-['*'] group-data-[required=true]:after:text-danger group-data-[required=true]:after:ml-0.5 group-data-[invalid=true]:text-danger w-full text-tiny cursor-text !ease-out !duration-200 will-change-auto motion-reduce:transition-none transition-[color,opacity] ">
                    Seleccionar el elemento
                </label>
                <input
                    type="text"
                    id="autocomplete-elements"
                    aria-label="autocomplete-elements"
                    placeholder="Busca un elemento"
                    value={inputValue}
                    onChange={handleInputChange}
                    className={`flex items-center text-[14px] w-full gap-x-2 h-6 bg-transparent placeholder:text-default-400 focus:outline-none  ${errors.element_id ? 'text-red-500 placeholder:text-red-600' : 'text-black'} `}
                />

            </div>
            {errors.element_id && (
                <p className="mt-2 pl-4 text-tiny text-red-600">
                    {errors.element_id}
                </p>
            )}
            {isDropdownVisible && (
                <ul className="z-10 inline-flex flex-col items-left justify-center subpixel-antialiased outline-none box-border text-small bg-content1 rounded-large shadow-medium w-full p-1 overflow-hidden">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <li
                                key={item.codigo}
                                value={item.codigo}
                                onClick={() => handleSelect(item.codigo, `${item.codigo} ${item.name}`)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {item.codigo + ' ' + item.name}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-500">
                            Resultados no encontrados
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteMine;
