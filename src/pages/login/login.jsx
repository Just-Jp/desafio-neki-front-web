import { useEffect, useState } from "react";
import styles from "./login.module.css";
import API_BASE_URL from "../../api/api";
import { Eye, EyeSlash } from "phosphor-react";

export default function LoginPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("auth_saved");
        if (saved) {
            try {
                const { login: l, password: p } = JSON.parse(saved);
                setLogin(l || "");
                setPassword(p || "");
                setRemember(true);
            } catch (_) { }
        }
    }, []);

    useEffect(() => {
        if (remember) {
            localStorage.setItem("auth_saved", JSON.stringify({ login, password }));
        } else {
            localStorage.removeItem("auth_saved");
        }
    }, [remember, login, password]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: login, password }),
            });
            if (!res.ok) throw new Error("Email ou Senha Invalidos");
            const data = await res.json().catch(() => ({}));
            if (data.token) localStorage.setItem("token", data.token);
            window.location.href = "/";
        } catch (err) {
            setError(err.message || "Erro ao efetuar login");
        } finally {
            setLoading(false);
        }
    }

    function handleRememberChange(e) {
        setRemember(e.target.checked);
    }

    return (
        <div className={styles.body}>

            <form className={styles.form} onSubmit={handleSubmit}>

                <div className={styles.userWrapper}>
                    <input
                        className={styles.userInput}
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Usuario"
                        aria-label="Usuario"
                        required
                        autoComplete="username"
                    />
                </div>
                <div className={styles.passwordWrapper}>
                    <input
                        className={styles.passwordInput}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        aria-label="Senha"
                        required
                        autoComplete={remember ? "current-password" : "off"}
                    />
                    <button
                        className={styles.passwordToggleButton}
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                        {showPassword ? (
                            <EyeSlash size={28} weight="light" />) : (<Eye size={28} weight="light" />
                        )}
                    </button>
                </div>

                <div className={styles.utilityWrapper}>
                    <div className={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={handleRememberChange}
                        />
                        <p>Lembrar-se</p>
                    </div>
                    <button
                        type="button"
                        className={styles.registerButton}
                        onClick={() => (window.location.href = "/register")}
                    >
                        Cadastrar-se
                    </button>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>

            </form>
        </div>
    );
}