let notificationsStore = [
    {
        id: '1',
        category: 'Review Request',
        priority: 'Critical',
        title: 'Milestone Review Assigned: Tokio Rust Engine',
        body: 'Accountability partner @Alex requested peer review for Milestone 1 proof submission.',
        time: '10 Minutes Ago',
        read: false,
        actionable: true,
        type: 'review'
    },
    {
        id: '2',
        category: 'Discipline Warning',
        priority: 'High',
        title: 'Consecutive Miss Penalty Trigger Warning',
        body: 'Task "Discrete Mathematics Revision" is approaching 24h expiration window.',
        time: '1 Hour Ago',
        read: false,
        actionable: false,
        type: 'warning'
    },
    {
        id: '3',
        category: 'Friend Request',
        priority: 'Medium',
        title: 'Friend Request Received from @Sarah',
        body: 'Sarah invited you to join Gym Squad Accountability Group.',
        time: '3 Hours Ago',
        read: true,
        actionable: true,
        type: 'friend'
    }
];

exports.getNotifications = async (req, res) => {
    try {
        res.status(200).json(notificationsStore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

exports.markRead = async (req, res) => {
    try {
        const { id } = req.params;
        const item = notificationsStore.find(n => n.id === id);
        if (item) {
            item.read = true;
            return res.status(200).json(item);
        }
        res.status(404).json({ message: 'Notification not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error marking notification as read' });
    }
};

exports.markAllRead = async (req, res) => {
    try {
        notificationsStore.forEach(n => n.read = true);
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error marking all read' });
    }
};
