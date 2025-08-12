import { useState } from "react";
import styles from "./register.module.css";
import API_BASE_URL from "../../api/api";
import { Eye, EyeSlash } from "phosphor-react";
import axios from "axios";

export default function RegisterPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

        async function handleSubmit(e) {
            e.preventDefault();
            setError(null);
            setSuccess(null);
            if (password !== confirmPassword) {
                setError("As senhas não coincidem.");
                return;
            }
            setLoading(true);
            try {
                await axios.post(`${API_BASE_URL}/auth/register`, {
                    username: login,
                    password,
                });
                setSuccess("Cadastro realizado com sucesso!");
                setLogin("");
                setPassword("");
                setConfirmPassword("");
            } catch (err) {
                setError(
                    err.response?.data?.message || err.message || "Erro ao cadastrar usuário"
                );
            } finally {
                setLoading(false);
            }
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
                        autoComplete="new-password"
                    />
                    <button
                        className={styles.passwordToggleButton}
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                        {showPassword ? (
                            <EyeSlash size={28} weight="light" />
                        ) : (
                            <Eye size={28} weight="light" />
                        )}
                    </button>
                </div>
                <div className={styles.confirmPasswordWrapper}>
                    <input
                        className={styles.passwordInput}
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar Senha"
                        aria-label="Confirmar Senha"
                        required
                        autoComplete="new-password"
                    />
                    <button
                        className={styles.passwordToggleButton}
                        type="button"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                        aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                        {showConfirmPassword ? (
                            <EyeSlash size={28} weight="light" />
                        ) : (
                            <Eye size={28} weight="light" />
                        )}
                    </button>
                </div>
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </form>
        </div>
    );
}