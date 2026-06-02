export default function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ caracteres', pass: password.length >= 8 },
    { label: 'Mayúscula', pass: /[A-Z]/.test(password) },
    { label: 'Minúscula', pass: /[a-z]/.test(password) },
    { label: 'Número', pass: /\d/.test(password) },
  ];

  return (
    <ul className="password-strength-list">
      {checks.map((c, i) => (
        <li key={i} style={{ color: c.pass ? '#28a745' : '#dc3545' }}>
          {c.pass ? '✓' : '○'} {c.label}
        </li>
      ))}
    </ul>
  );
}
