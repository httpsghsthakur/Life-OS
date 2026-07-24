const { Exam, ExamSubject, Challenge } = require('../models');

exports.activateExamMode = async (req, res) => {
    try {
        const { title, start_date, end_date, subjects } = req.body;

        // Pause all active challenges
        await Challenge.update(
            { status: 'paused' },
            { where: { user_id: req.user.id, status: 'active' } }
        );

        const exam = await Exam.create({
            user_id: req.user.id,
            title,
            start_date,
            end_date,
            is_active: true
        });

        const subjectRecords = subjects.map(s => ({
            exam_id: exam.id,
            name: s.name,
            target_date: s.target_date
        }));

        await ExamSubject.bulkCreate(subjectRecords);

        res.status(201).json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error activating exam mode' });
    }
};

exports.deactivateExamMode = async (req, res) => {
    try {
        const { exam_id } = req.params;
        
        const exam = await Exam.findOne({ where: { id: exam_id, user_id: req.user.id } });
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        exam.is_active = false;
        await exam.save();

        // Resume paused challenges
        await Challenge.update(
            { status: 'active' },
            { where: { user_id: req.user.id, status: 'paused' } }
        );

        res.status(200).json({ message: 'Exam deactivated and challenges resumed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deactivating exam mode' });
    }
};

exports.getActiveExam = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            where: { user_id: req.user.id, is_active: true },
            include: [{ model: ExamSubject, as: 'subjects' }]
        });
        res.status(200).json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching active exam' });
    }
};
