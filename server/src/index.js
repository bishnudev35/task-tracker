import express from 'express';
import prisma from './lib/db.js'
import registerRouter from "./router/register.router.js"
import loginRouter from "./router/login.router.js"
import creatTaskRouter from "./router/creatTask.router.js"
import deleteTaskRouter from "./router/deleteTask.router.js"
import updateTaskRouter from "./router/updateTask.router.js"
import getTaskRouter from "./router/fetchAllTask.router.js"
const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
prisma.$connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });
app.use('/api/v1',registerRouter);
app.use('/api/v1',loginRouter);
app.use('/api/v1',creatTaskRouter);
app.use('/api/v1',deleteTaskRouter);
app.use('/api/v1',updateTaskRouter);
app.use('/api/v1',getTaskRouter);

const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
