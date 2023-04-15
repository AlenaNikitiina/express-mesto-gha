const { PORT = 3000 } = process.env;
const { SERVER_ADDRESS = 'mongodb://127.0.0.1/mestodb' } = process.env;

module.exports = { PORT, SERVER_ADDRESS };
