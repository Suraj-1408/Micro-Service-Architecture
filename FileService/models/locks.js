//Handles lock  logic to prevent multiple users to edit row.
const locks = {};

exports.isRowLocked = (row) => locks.hasOwnProperty(row);

exports.getLockOwner = (row) => locks[row];

exports.lockRow = (row, userId) => {
  locks[row] = userId;
};

exports.unlockRow = (row) => {
  delete locks[row];
};