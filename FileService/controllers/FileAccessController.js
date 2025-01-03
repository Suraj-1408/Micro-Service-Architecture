const fileAccessService = require('../services/fileAccessService');

async function grantAccessHandler(req, res) {
  const { student_id, file_id, can_access } = req.body;
  try {
    await fileAccessService.grantAccess(student_id, file_id, can_access);
    res.status(200).send({ message: 'Access updated successfully' });
  } catch (error) {
    console.error('Error updating access:', error);
    res.status(500).send({ error: 'Failed to update access' });
  }
}

async function getAccessibleFilesHandler(req, res){
  const { email, student_name } = req.query; // Retrieve email or student_name from query params

  if (!email && !student_name) {
    return res.status(400).json({ error:'Missing email or student_name in request' });
  }

  try {
    // Check if user exists by email or student_name
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { student_name }]
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch files the user has access to
    const files = await File.findAll({
      include: {
        model: User,
        where: { id: user.id, can_access: true },
      },
    });

    res.json(files);
  } catch (err) {
    console.error('Error fetching user files:', err);
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
}

module.exports = { grantAccessHandler, getAccessibleFilesHandler };
