const Application = require('../models/Application');
const Project = require('../models/Project');
const Notification = require('../models/Notification');


// POST /api/projects/:id/apply
exports.apply = async (req, res) => {
    try {
        const { role, message } = req.body;
        const projectId = req.params.id;

        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        // Check project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Prevent applying to own project
        if (project.creator.toString() === req.user.userId) {
            return res.status(400).json({ message: 'Cannot apply to your own project' });
        }

        // Check duplicate
        const existing = await Application.findOne({
            project: projectId,
            applicant: req.user.userId,
            role
        });

        if (existing) {
            return res.status(400).json({
                message: 'You have already applied for this role',
                status: existing.status
            });
        }

        const application = new Application({
            project: projectId,
            applicant: req.user.userId,
            role,
            message: message || ''
        });

        await application.save();

        await Notification.create({
            recipient: project.creator,
            sender: req.user.userId,
            type: 'new_application',
            project: projectId,
            message: `Someone applied for the "${role}" role on your project "${project.title}"`
        });
        await application.populate('applicant', 'name role profileImage college');
        await application.populate('project', 'title');

        res.status(201).json(application);

    } catch (err) {
        console.error('Apply error:', err);
        res.status(500).json({ message: 'Error submitting application' });
    }
};

// GET /api/projects/:id/applications
exports.getApplications = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only creator can see applications
        if (project.creator.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ project: req.params.id })
            .populate('applicant', 'name role profileImage college bio')
            .sort({ createdAt: -1 });

        res.json(applications);

    } catch (err) {
        console.error('Get applications error:', err);
        res.status(500).json({ message: 'Error fetching applications' });
    }
};

// GET /api/applications/my — check own applications
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.userId })
            .populate('project', 'title')
            .sort({ createdAt: -1 });

        res.json(applications);

    } catch (err) {
        console.error('Get my applications error:', err);
        res.status(500).json({ message: 'Error fetching applications' });
    }
};

// PUT /api/applications/:id
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be accepted or rejected' });
        }

        const application = await Application.findById(req.params.id)
            .populate('project')
            .populate('applicant', 'name role profileImage');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Only project creator can update
        if (application.project.creator.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = status;

        if (status === 'accepted') {
            const project = await Project.findById(application.project._id);

            // Only add if not already a team member
            const alreadyMember = project.teamMembers.some(
                m => m.toString() === application.applicant._id.toString()
            );

            if (!alreadyMember) {
                project.teamMembers.push(application.applicant._id);
                project.teamSize = project.teamMembers.length + 1;
                await project.save();
            }
        }

        await application.save();

        // ── Create notification for applicant ──
        await Notification.create({
            recipient: application.applicant._id,
            sender: req.user.userId,
            type: status === 'accepted' ? 'application_accepted' : 'application_rejected',
            project: application.project._id,
            message: status === 'accepted'
                ? `Your application for "${application.role}" on "${application.project.title}" was accepted!`
                : `Your application for "${application.role}" on "${application.project.title}" was not accepted this time.`
        });

        res.json(application);

    } catch (err) {
        console.error('Update application error:', err);
        res.status(500).json({ message: 'Error updating application' });
    }
};