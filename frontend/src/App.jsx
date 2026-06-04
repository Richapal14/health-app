import { useState } from "react";
import { PatientForm } from "./components/patient-form";
import { PatientTable } from "./components/patient-table";
import { usePatients } from "./hooks/use-patients";
import "./styles/tokens.css";
import styles from "./app.module.css";

export default function App() {
  const { patients, loading, error, add, patch, remove, remark } = usePatients();
  const [editing, setEditing] = useState(null); // null | "new" | patient object
  const [saving, setSaving] = useState(false);

  const handleSave = async body => {
    setSaving(true);
    try {
      if (editing === "new") {
        await add(body);
      } else {
        await patch(editing.id, body);
      }
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1>Health predictor</h1>
          <p>Patient blood test records with AI risk analysis</p>
        </div>
        <button className="primary" onClick={() => setEditing("new")}>
          + Add patient
        </button>
      </header>

      {editing && (
        <div className={styles.formCard}>
          <h2>{editing === "new" ? "New patient" : `Editing — ${editing.full_name}`}</h2>
          <PatientForm
            initial={editing === "new" ? {} : editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        </div>
      )}

      <main>
        {loading && <p className={styles.state}>Loading…</p>}
        {error   && <p className={styles.state} style={{ color: "var(--danger)" }}>{error}</p>}
        {!loading && !error && (
          <PatientTable
            patients={patients}
            onEdit={p => setEditing(p)}
            onDelete={remove}
            onRemark={remark}
          />
        )}
      </main>
    </div>
  );
}
