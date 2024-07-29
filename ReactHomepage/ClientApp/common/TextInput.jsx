import React from "react";
const TextInput = (props) => {
  const handleChange = e => {
    props.onTextChanged(e.target.value);
  };

  return (
    <div style={{ display: 'inline' }}><strong>{props.preText}&nbsp;</strong>
      <input
        type={props.type}
        style={{ textAlign: "center" }}
        value={props.text}
        placeholder={props.placeholder}
        onChange={handleChange}
      />
     </div>
  );
}

export default TextInput