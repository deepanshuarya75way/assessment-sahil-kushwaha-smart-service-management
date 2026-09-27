const Ticket = require('../models/Ticket');

/**
 * Generate sequential ticket number string (e.g. TICK-1001, TICK-1002)
 */
const generateTicketNumber = async () => {
  const count = await Ticket.countDocuments();
  const nextNum = 1000 + count + 1;
  return `TICK-${nextNum}`;
};

module.exports = generateTicketNumber;
