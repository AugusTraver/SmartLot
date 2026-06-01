export default function LoginForm({ onToggle }) {
  return (
    <div className="w-full max-w-sm">
      <h1 className="auth-stagger text-3xl md:text-4xl font-extrabold text-brand-warm mb-1" style={{ fontFamily: 'var(--font-display)' }}>
        Iniciar Sesión
      </h1>
      <p className="auth-stagger text-brand-muted text-sm md:text-base mb-8 leading-relaxed">
        Ingresá a tu panel de gestión
      </p>

      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <div className="auth-stagger flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-muted" style={{ fontFamily: 'var(--font-body)' }}>
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="tu@empresa.com"
            className="w-full px-5 py-3.5 bg-brand-surface/70 border border-brand-deep/10 rounded-xl text-brand-warm text-base placeholder:text-brand-muted/50 outline-none transition-all duration-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>

        <div className="auth-stagger flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-muted" style={{ fontFamily: 'var(--font-body)' }}>
            Contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-5 py-3.5 bg-brand-surface/70 border border-brand-deep/10 rounded-xl text-brand-warm text-base placeholder:text-brand-muted/50 outline-none transition-all duration-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>

        <button
          type="submit"
          className="auth-stagger w-full mt-2 px-8 py-4 bg-brand-blue text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-blue/20 transition-all duration-300 hover:bg-brand-deep hover:shadow-brand-deep/25 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
        >
          Ingresar
        </button>
      </form>

      <p className="auth-stagger mt-8 text-center text-sm text-brand-muted">
        ¿No tenés cuenta?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="font-semibold text-brand-blue transition-colors duration-300 hover:text-brand-deep focus-visible:outline-none focus-visible:underline"
        >
          Registrarse
        </button>
      </p>
    </div>
  );
}
