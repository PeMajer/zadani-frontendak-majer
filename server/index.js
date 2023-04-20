const express = require('express');
const jsonGraphqlExpress = require('json-graphql-server').default;
const data = require('./data.json');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use('/graphql', jsonGraphqlExpress(data));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/graphql`);
});
