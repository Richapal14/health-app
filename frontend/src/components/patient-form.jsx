import { useReducer, useState } from "react";
import styles from "./patient-form.module.css";

const today = new Date().toISOString().slice(0, 10);

const empty = {
  full_name:   "",
  dob:         "",
  email:       "",
  record_date: today,
  glucose:     "",
  haemoglobin: "",
  cholesterol: "",
};

function formReducer(state, { field, value }) {
  return { ...state, [field]: value };
}

export function PatientForm({ initial = {}, onSave, onCancel, saving }) {
  const [fields, dispatch] = useReducer(formReducer, { ...empty, ...initial });
  const [err, setErr] = useState(null);

  const set = field => e => dispatch({ field, value: e.target.value });

  const submit = async () => {
    setErr(null);
    try {
      await onSave({
        ...fields,
        glucose:     parseFloat(fields.glucose),
        haemoglobin: parseFloat(fields.haemoglobin),
        cholesterol: parseFloat(fields.cholesterol),
      });
    } catch (e) {
      const detail = e?.response?.data?.detail;
      setErr(
        Array.isArray(detail)
          ? detail.map(d => d.msg).join("; ")
          : detail ?? "something went wrong"
      );
    }
  };

  return (
    <div className={styles.form}>
      {err && <p className={styles.err}>{err}</p>}

      <div className={styles.row}>
        <label>Full name
          <input value={fields.full_name} onChange={set("full_name")} placeholder="e.g. Priya Sharma" />
        </label>
        <label>Date of birth
          <input type="date" value={fields.dob} onChange={set("dob")} max={today} />
        </label>
      </div>

      <div className={styles.row}>
        <label>Email
          <input type="email" value={fields.email} onChange={set("email")} placeholder="patient@email.com" />
        </label>
        <label>Test / record date
          <input type="date" value={fields.record_date} onChange={set("record_date")} max={today} />
        </label>
      </div>

      <div className={styles.row}>
        <label>Glucose <span className={styles.unit}>(mg/dL)</span>
          <input type="number" value={fields.glucose} onChange={set("glucose")} placeholder="70–200" min="1" max="600" step="0.1" />
        </label>
        <label>Haemoglobin <span className={styles.unit}>(g/dL)</span>
          <input type="number" value={fields.haemoglobin} onChange={set("haemoglobin")} placeholder="8–18" min="1" max="25" step="0.1" />
        </label>
        <label>Cholesterol <span className={styles.unit}>(mg/dL)</span>
          <input type="number" value={fields.cholesterol} onChange={set("cholesterol")} placeholder="100–300" min="1" max="600" step="0.1" />
        </label>
      </div>

      <div className={styles.actions}>
        <button onClick={onCancel}>Cancel</button>
        <button className="primary" onClick={submit} disabled={saving}>
          {saving ? "Saving…" : "Save record"}
        </button>
      </div>
    </div>
  );
}
