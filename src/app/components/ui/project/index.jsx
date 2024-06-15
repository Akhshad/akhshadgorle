import React from 'react';
import styles from './style.module.css';

export default function Project({ title, description, setModal, view }) {
    const handleClick = () => {
        if (view) {
            window.open(view, '_blank'); // Opens link in a new tab
        } else {
            // Handle no view case if needed
        }
    };

    return (
        <div
            onMouseEnter={() => setModal({ active: true })}
            onMouseLeave={() => setModal({ active: false })}
            className={styles.project}
            onClick={handleClick} // Call handleClick on click event
        >
            <h2>{title}</h2>
           
            {view && <div className={styles.viewLink}></div>} {/* Conditionally render view link */}
            <p>{description}</p>
        </div>
    );
}
