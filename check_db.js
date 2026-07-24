require('dotenv').config();
const { sequelize } = require('./src/models');

async function createDatabaseIndexes() {
    try {
        console.log('Creating database indexes for lightning-fast query execution...');
        
        await sequelize.query('CREATE INDEX IF NOT EXISTS idx_exam_sessions_user_active ON "ExamSessions" ("user_id", "is_active");');
        await sequelize.query('CREATE INDEX IF NOT EXISTS idx_exam_subjects_session ON "ExamSubjects" ("exam_session_id");');
        await sequelize.query('CREATE INDEX IF NOT EXISTS idx_exam_topics_subject ON "ExamTopics" ("subject_id");');
        await sequelize.query('CREATE INDEX IF NOT EXISTS idx_study_logs_session ON "StudyLogs" ("exam_session_id");');
        await sequelize.query('CREATE INDEX IF NOT EXISTS idx_study_logs_subject ON "StudyLogs" ("subject_id");');
        await sequelize.query('CREATE INDEX IF NOT EXISTS idx_mock_tests_session ON "MockTests" ("exam_session_id");');

        console.log('ALL INDEXES CREATED SUCCESSFULLY!');
    } catch (e) {
        console.error('INDEX CREATION ERROR:', e);
    }
    process.exit(0);
}
createDatabaseIndexes();
