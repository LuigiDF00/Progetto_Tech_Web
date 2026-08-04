const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Back-end WebTech RegexRiddle in ascolto sulla porta ${PORT}`);
});
