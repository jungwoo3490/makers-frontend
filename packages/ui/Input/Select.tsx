import { useState, useRef, useEffect, useCallback } from 'react';
import { IconChevronDown, IconUser } from '@sopt-makers/icons';
import * as S from './style.css';

export interface Option<T> {
  label: string;
  value: T;
  description?: string;
  icon?: React.ReactNode;
  profileUrl?: string;
}

interface SelectProps<T> {
  className?: string;
  placeholder?: string;
  type: 'Text' | 'TextDesc' | 'TextIcon' | 'UserList' | 'UserListDesc';
  options: Option<T>[];
  visibleOptions?: number;
  defaultValue?: T;
  onChange: (value: T) => void;
}

function Select<T extends string | number | boolean>(props: SelectProps<T>) {
  const { className, placeholder, type, options, visibleOptions = 5, defaultValue, onChange } = props;

  const optionsRef = useRef<HTMLUListElement>(null);

  const [selected, setSelected] = useState<T | null>(defaultValue ?? null);
  const [open, setOpen] = useState(false);

  const handleToggleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleToggleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const calcMaxHeight = useCallback(() => {
    const getOptionHeight = () => {
      switch (type) {
        case 'Text':
        case 'TextIcon':
          return 42;
        case 'TextDesc':
        case 'UserListDesc':
          return 62;
        case 'UserList':
          return 48;
      }
    }
    const gapHeight = 6;
    const paddingHeight = 8;

    return getOptionHeight() * visibleOptions + gapHeight * (visibleOptions - 1) + paddingHeight * 2;
  }, [visibleOptions, type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        handleToggleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [handleToggleClose]);

  const handleOptionClick = (value: T) => {
    setSelected(value);
    onChange(value);
    handleToggleClose();
  }

  return <div className={`${S.selectWrap} ${className}`}>
    <button className={S.select} onClick={handleToggleOpen} type="button">
      <p className={!selected ? S.selectPlaceholder : ''}>{selected ?? placeholder}</p>
      <IconChevronDown style={{ width: 20, height: 20, transform: open ? 'rotate(-180deg)' : '', transition: 'all 0.5s' }} />
    </button>

    {open ? <ul className={S.optionList} ref={optionsRef} style={{ maxHeight: calcMaxHeight() }}>
      {options.map(option =>
        <li key={option.label}>
          <button className={S.option} onClick={() => { handleOptionClick(option.value); }} type="button">
            {type === 'TextIcon' && option.icon}
            {(type === 'UserList' || type === 'UserListDesc') && (option.profileUrl ? <img alt={option.label} className={S.optionProfileImg} src={option.profileUrl} /> : <div className={S.optionProfileEmpty}><IconUser /></div>)}

            <div>
              <p>{option.label}</p>
              {(type === 'TextDesc' || type === 'UserListDesc') && <p className={S.optionDesc}>{option.description}</p>}
            </div>
          </button>
        </li>
      )}
    </ul> : null}
  </div>
}

export default Select;