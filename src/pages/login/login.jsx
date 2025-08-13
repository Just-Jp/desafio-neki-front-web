import { useEffect, useState } from "react";
import styles from "./login.module.css";
import API_BASE_URL from "../../api/api";
import { Eye, EyeSlash } from "phosphor-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, {
                username: login,
                password,
            });
            const data = res.data;
            if (data.token && data.userId) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", login);
                localStorage.setItem("userId", data.userId);
                navigate("/home");
            }
        } catch (err) {
            setError(
                err.response?.data?.message || err.message || "Erro ao efetuar login"
            );
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
                            onClick={() => navigate("/register")}
                        >
                            Cadastrar-se
                        </button>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                        <button type="submit" className={styles.submitBtn}>
                            Entrar
                        </button>

            </form>
        </div>
    );
}