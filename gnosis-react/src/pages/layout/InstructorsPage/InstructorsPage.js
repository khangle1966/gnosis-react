import React, { useState } from "react";
import styles from "./InstructorsPage.module.scss";

const InstructorsPage = ({ onImageUpload }) => {
    const [description, setDescription] = useState('');
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    const [courseData, setCourseData] = useState({
        type: "",
        title: "",
        category: "",
        description: "",
        language: "",
        pricing: "",
        coverImage: "",
        lectures: [],
        isReleased: false,
    });
    const handleSubmit = (event) => {
        event.preventDefault();
        // Implement submit logic
    };

    return (
        <div className={styles.Container}>
            <div className={styles.Header}>
                <h1 className={styles.Title}>New course creation</h1>
                <div className={styles.Container_Button}>
                    <button className={styles.Cancel_Button}>Cancel</button>
                    <button className={styles.Publish_Button}>Publish</button>
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.leftSection}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">TITLE</label>
                        <input type="text" id="title" placeholder="e.g. Networking Fundamentals Course" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="category">CATEGORY</label>
                        <select id="category">
                            <option value="it_certifications">IT Certifications</option>
              // Add more options
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">DESCRIPTION</label>
                        <textarea
                            id="description"
                            placeholder="Description"
                            maxLength="2500"
                            value={description}
                            onChange={handleDescriptionChange}
                        ></textarea>
                        <div className={styles.characterCount}>
                            {description.length}/2500 characters
                        </div>
                    </div>

                    <div className={styles.formGroupDual}>
                        <div className={styles.language}>
                            <label htmlFor="language">LANGUAGE</label>
                            <select id="language">
                                <option value="english">English</option>
                // Add more options
                            </select>
                        </div>

                        <div className={styles.pricing}>
                            <label htmlFor="pricing">PRICING</label>
                            <input type="text" id="pricing" placeholder="USD, per hour" />
                        </div>
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <div className={styles.uploadSection}>
                        <h2>COVER IMAGE</h2>
                        <div className={styles.uploadArea}>
                            <button type="button" className={styles.uploadBtn}>📷 Upload</button>
                        </div>
                    </div>

                    <div className={styles.uploadSection}>
                        <h2>LECTURES</h2>
                        <div className={styles.uploadArea}>
                            <button type="button" className={styles.uploadLessonBtn}>📁 Upload</button>
                            <button type="button" className={styles.addBtn}>➕ Add</button>
                        </div>
                    </div>
                </div>


            </form>
        </div>
    );
};


export default InstructorsPage;