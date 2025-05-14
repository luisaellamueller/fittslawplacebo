const SelectField = ({ label, name, value, options, onChange, required }) => {
    return (
      <label className="block">
        {label}:
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded"
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  };
  
  export default SelectField;
  