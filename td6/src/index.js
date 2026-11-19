import express from 'express';

const app = express();
const PORT = 80;

app.get('/', (req, res) => {
    res.send('modification grace au bind mount !');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
