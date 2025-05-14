const InputField = ({ type, name, placeholder, value, onChange, required }) => {
    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded"
        required={required}
      />
    );
  };
  
  export default InputField;
  