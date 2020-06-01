import express from 'express'

const app = express()

app.get('/users', (req, res) => res.json([
    'Ariel',
    'Sharon',
    'Matheus',
    'Leandro'
]) )

app.listen(3333)