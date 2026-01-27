import Icon from './Icon';

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean, shiftKey: boolean) => void;
}

export default function Checkbox({ checked, indeterminate, onChange }: CheckboxProps) {
  return (
    <label className="checkbox-wrapper">
      <input
        type="checkbox"
        checked={checked}
        ref={(input) => {
          if (input) {
            input.indeterminate = indeterminate || false;
          }
        }}
        onClick={(e) => {
          const newChecked = !checked;
          onChange(newChecked, e.shiftKey);
        }}
        onChange={() => {
          // onChange is required for controlled component, but we handle logic in onClick
        }}
        className="checkbox-input"
      />
      <Icon
        src={indeterminate ? '/icons/checkbox-indeterminate.svg' : checked ? '/icons/checkbox-filled.svg' : '/icons/checkbox-empty.svg'}
        alt={indeterminate ? 'Indeterminate' : checked ? 'Checked' : 'Unchecked'}
        width={16}
        height={16}
        className="checkbox-icon"
      />
      <style jsx>{`
        .checkbox-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: 16px;
          height: 16px;
          position: relative;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checkbox-icon {
          display: block;
          transition: opacity 0.15s ease;
        }

        .checkbox-wrapper:hover .checkbox-icon {
          opacity: 0.8;
        }
      `}</style>
    </label>
  );
}
