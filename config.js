const { PORT = 3000 } = process.env;
const { SERVER_ADDRESS = 'mongodb://127.0.0.1/mestodb' } = process.env;
const { JWT_SECRET = 'JWT_SECRET' } = process.env;

const URL_CHECK = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  PORT, SERVER_ADDRESS, JWT_SECRET, URL_CHECK,
};
