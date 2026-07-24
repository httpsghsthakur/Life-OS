import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../../context/AuthContext";
import ExamDashboard from "../../pages/exam/ExamDashboard";
import { useLocation } from 'react-router-dom';

export default function ExamShield({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;

    if (user?.is_in_exam_mode) {
        // Exam Shield is ACTIVE. Intercept all standard UI and render the Exam layout.
        return <ExamDashboard />;
    }

    // Exam Shield is INACTIVE. Render standard LifeOS.
    return <>{children}</>;
}
