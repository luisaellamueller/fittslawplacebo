import InputField from "./InputField";
import SelectField from "./SelectField";

const Form = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        type="text"
        name="vorname"
        placeholder="Vorname"
        value={formData.vorname}
        onChange={handleChange}
        required
      />
      <InputField
        type="text"
        name="nachname"
        placeholder="Nachname"
        value={formData.nachname}
        onChange={handleChange}
        required
      />
      <InputField
        type="date"
        name="geburtsdatum"
        value={formData.geburtsdatum}
        onChange={handleChange}
        required
      />
      <SelectField
        label="Technischer Studiengang"
        name="technischer_studiengang"
        value={formData.technischer_studiengang.toString()}
        options={[
          { label: "Ja", value: "true" },
          { label: "Nein", value: "false" },
        ]}
        onChange={handleChange}
        required
      />
      <SelectField
        label="Stufe"
        name="stufe"
        value={formData.stufe}
        options={[
          { label: "Bachelor", value: "Bachelor" },
          { label: "Master", value: "Master" },
          { label: "PhD", value: "PhD" },
        ]}
        onChange={handleChange}
        required
      />
      <button type="submit">Speichern</button>
    </form>
  );
};

export default Form;
