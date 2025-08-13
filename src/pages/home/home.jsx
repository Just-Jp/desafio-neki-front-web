import styles from "./home.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pen, Plus, SignOut, Trash, Check, X } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../api/api";

export default function HomePage() {
    const [skills, setSkills] = useState([]);
    const [username, setUsername] = useState("");
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [allSkills, setAllSkills] = useState([]);
    const navigate = useNavigate();
    
    function handleShowModal() {
        setShowModal(true);
        const token = localStorage.getItem("token");
        axios.get(`${API_BASE_URL}/skills`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => setAllSkills(res.data))
        .catch(() => setAllSkills([]));
    }
    
    
    function handleLogout() {
        localStorage.clear();
        navigate("/");
    }
    
    function handleLevelEdit(skill) {
        setEditing(true);
        setEditingId(skill.id);
    }
    
    function handleAcceptLevel(skillId) {
        const token = localStorage.getItem("token");
        const input = document.querySelector(`#level-input-${skillId}`);
        const updatedLevel = input ? input.value : "";
        axios.put(`${API_BASE_URL}/user-skills/${skillId}`, { level: updatedLevel }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            window.location.reload();
        });
    }
    
    function handleSkillDelete(skillId) {
        const token = localStorage.getItem("token");
        axios.delete(`${API_BASE_URL}/user-skills/${skillId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            setSkills(skills.filter(skill => skill.id !== skillId));
        });
    }
    
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername || "");
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const token = localStorage.getItem("token");
        axios.get(`${API_BASE_URL}/users/${userId}/skills`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => setSkills(res.data))
        .catch(() => setSkills([]));
    }, []);
    
    function handleAddSkillToUser(skillId) {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const input = document.querySelector(`#modal-level-input-${skillId}`);
        const level = input ? input.value : "";
        const payload = {
            skillId: skillId,
            level: Number(level)
        };
        console.log("JSON enviado:", payload);
        axios.post(`${API_BASE_URL}/users/${userId}/skills`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            setShowModal(false);
            window.location.reload();
        })
        .catch((err) => {
            alert("Erro ao adicionar skill");
        });
    }

    return (
        <div className={styles.body}>
            {showModal && (
                <div className={styles.modalOverlay}>
                    <button className={styles.closeButton} onClick={() => setShowModal(false)}> <X size={32} /> </button>
                    <div className={styles.modalContent}>
                        <table className={styles.skillsTable}>
                            <thead>
                                <tr>
                                    <th>Skill</th>
                                    <th>Descrição</th>
                                    <th>Nível</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allSkills.map((skill, idx) => (
                                    <tr key={skill.id || idx} className={styles.skillRow}>
                                        <td className={styles.skillCell}>
                                            <img src={skill.imageUrl} alt={skill.skillName} className={styles.skillIcon} />
                                            <span className={styles.skillName}>{skill.name}</span>
                                        </td>
                                        <td className={styles.descriptionCell}>{skill.description}</td>
                                        <td className={styles.levelCell}>
                                            <input type="text" id={`modal-level-input-${skill.id}`} placeholder="Nível" />
                                        </td>
                                        <td className={styles.buttonsCell}>
                                            <button className={styles.skillAddButton} onClick={() => handleAddSkillToUser(skill.id)}> <Plus size={20} /> </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <div className={styles.container}>
                <table className={styles.skillsTable}>
                    <thead>
                        <tr>
                            <th>Skill</th>
                            <th>Nivel</th>
                            <th>Descrição</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((skill, idx) => (
                            <tr key={skill.id || idx} className={styles.skillRow}>
                                <td className={styles.skillCell}>
                                    <img src={skill.imageUrl} alt={skill.skillName} className={styles.skillIcon} />
                                    <span className={styles.skillName}>{skill.skillName}</span>
                                </td>
                                <td className={styles.levelCell}>
                                    {editing && editingId === skill.id ? (
                                        <input
                                            type="text"
                                            defaultValue={skill.level}
                                            id={`level-input-${skill.id}`}
                                            className={styles.levelInput}
                                        />
                                    ) : (
                                        skill.level
                                    )}
                                </td>
                                <td className={styles.descriptionCell}>{skill.description}</td>
                                <td className={styles.buttonsCell}>
                                    {editing && editingId === skill.id ? (
                                        <button className={styles.submitEditButton} onClick={() => handleAcceptLevel(skill.id)}> <Check size={20} /> </button>
                                    ) : (
                                        <button className={styles.editButton} onClick={() => handleLevelEdit(skill)}> <Pen size={20} /> </button>
                                    )}
                                    <button className={styles.deleteButton} onClick={() => handleSkillDelete(skill.id)}> <Trash size={20} /> </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.bottomButtonsWrapper}>
                    <button className={styles.addSkillButton} onClick={handleShowModal}> <Plus size={20} /> </button>
                    <button className={styles.logOutButton} onClick={handleLogout}> <SignOut size={20} /> </button>
                </div>
            </div>
        </div>
    );
}