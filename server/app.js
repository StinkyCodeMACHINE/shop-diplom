import express from 'express'
const app = express()
let data = {msg: "ass1"}

const port = process.env.PORT || 5500

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000");
  next();
});

app.get('/api/stuff', (req, res) => {
    res.status(200).json(data)
})

app.post('/api/stuff', (req, res) => {
    data.msg = data.msg+'1'
    res.status(200).json(data);
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
})