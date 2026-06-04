import { useState } from "react";
import styles from "./patient-table.module.css";

const THRESHOLDS = {
  glucose:      { low: 70,  high: 99  },
  haemoglobin:  { low: 12,  high: 17.5 },
  cholesterol:  { low: 0,   high: 200 },
};

function badge(key, val) {
  const t = THRESHOLDS[key];
  if (val < t.low)  return "low";
  if (val > t.high) return "high";
  return "ok";
}

// group consecutive rows by email so duplicate names show once as a header
function groupPatients(patients) {
  const groups = [];
  patients.forEach(p => {
    const last = groups[groups.length - 1];
    if (last && last.email === p.email && last.full_name === p.full_name) {
      last.records.push(p);
    } else {
      groups.push({ full_name: p.full_name, email: p.email, records: [p] });
    }
  });
  return groups;
}

export function PatientTable({ patients, onEdit, onDelete, onRemark }) {
  const [remarking, setRemarking] = useState(null);

  const handleRemark = async p => {
    setRemarking(p.id);
    try { await onRemark(p.id); }
    finally { setRemarking(null); }
  };

  if (!patients.length) {
    return <p className={styles.empty}>No patients yet — add one above.</p>;
  }

  const groups = groupPatients(patients);

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "18%" }}>Name</th>
            <th style={{ width: "8%" }}>Record #</th>
            <th style={{ width: "9%" }}>Test date</th>
            <th className={styles.num} style={{ width: "9%" }}>Glucose</th>
            <th className={styles.num} style={{ width: "9%" }}>Hb</th>
            <th className={styles.num} style={{ width: "9%" }}>Cholesterol</th>
            <th style={{ width: "28%" }}>AI remarks</th>
            <th style={{ width: "10%" }}></th>
          </tr>
        </thead>
        <tbody>
          {groups.map(group =>
            group.records.map((p, idx) => (
              <tr key={p.id} className={idx === 0 ? styles.groupFirst : styles.groupRow}>
                {/* Name cell — only shown on first row of each group */}
                <td className={styles.nameCell}>
                  {idx === 0 && (
                    <>
                      <span className={styles.name}>{p.full_name}</span>
                      <span className={styles.email}>{p.email}</span>
                      {group.records.length > 1 && (
                        <span className={styles.countBadge}>
                          {group.records.length} records
                        </span>
                      )}
                    </>
                  )}
                </td>
                <td className={styles.mono}>#{idx + 1}</td>
                <td className={styles.mono}>{p.record_date}</td>
                <td className={styles.num}>
                  <span className={`${styles.badge} ${styles[badge("glucose", p.glucose)]}`}>
                    {p.glucose}
                  </span>
                </td>
                <td className={styles.num}>
                  <span className={`${styles.badge} ${styles[badge("haemoglobin", p.haemoglobin)]}`}>
                    {p.haemoglobin}
                  </span>
                </td>
                <td className={styles.num}>
                  <span className={`${styles.badge} ${styles[badge("cholesterol", p.cholesterol)]}`}>
                    {p.cholesterol}
                  </span>
                </td>
                <td className={styles.remarks}>
                  {p.remarks && (
                    <span className={styles.remarkText}>{p.remarks}</span>
                  )}
                  <button
                    className={styles.genBtn}
                    onClick={() => handleRemark(p)}
                    disabled={remarking === p.id}
                  >
                    {remarking === p.id
                      ? "Generating…"
                      : p.remarks ? "Regenerate" : "Generate"}
                  </button>
                </td>
                <td className={styles.actions}>
                  <button onClick={() => onEdit(p)}>Edit</button>
                  <button onClick={() => onDelete(p.id)} className={styles.del}>Del</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
