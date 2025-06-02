// config/agenda.js
const Agenda = require("agenda");

const mongoConnectionString = process.env.MONGO_URI;

const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    collection: "agendaJobs",
  },
  processEvery: "1 minute",
  defaultConcurrency: 5,
});

module.exports = agenda;
