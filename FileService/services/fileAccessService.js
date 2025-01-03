const { sequelize } = require('../../config/db');

async function grantAccess(student_id, file_id, can_access) {
  const query = `
    INSERT INTO file_access (student_id, file_id, can_access)
    VALUES (:student_id, :file_id, :can_access)
    ON CONFLICT (student_id, file_id)
    DO UPDATE SET can_access = :can_access;
  `;
  await sequelize.query(query, {
    replacements: { student_id, file_id, can_access },
    type: sequelize.QueryTypes.INSERT,
  });
}

async function revokeAccess(student_id, file_id) {
  const query = `
    UPDATE file_access
    SET can_access = FALSE
    WHERE student_id = :student_id AND file_id = :file_id;
  `;
  await sequelize.query(query, {
    replacements: { student_id, file_id },
    type: sequelize.QueryTypes.UPDATE,
  });
}

async function getAccessibleFiles(student_id) {
  const query = `
    SELECT sf.id, sf.filename, sf.path, sf.upload_date, sf.admin_name
    FROM shared_files sf
    JOIN file_access fa ON sf.id = fa.file_id
    WHERE fa.student_id = :student_id AND fa.can_access = TRUE;
  `;
  return await sequelize.query(query, {
    replacements: { student_id },
    type: sequelize.QueryTypes.SELECT,
  });
}

module.exports = { grantAccess, revokeAccess, getAccessibleFiles };
