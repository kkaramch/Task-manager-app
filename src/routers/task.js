const express= require('express')
const Task= require('../models/task')
const router= new express.Router()

router.post('/tasks',async (req, res)=>{
    const task=new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks', async (req, res)=>{
    try{
        const tasks= await Task.find({})
        res.send(tasks)
    }catch{
        res.status(500).send()
    }
    
})

router.get('/tasks/:id',async (req, res)=>{
    const _id= req.params.id
    try{
        const task= await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch{
        res.status(500).send()
    }
})

router.patch('/tasks/:id',async (req, res)=>{
    const _id= req.params.id
    const updates= Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isValidUpdate= updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send('Is not a valid update.')
    }
    try{
        const task= await Task.findById(_id)
        updates.forEach((update)=> task[update]= req.body[update])
        await task.save()       
        if(!task){
           res.status(404).send()
       }
       res.send(task)
    }catch(e){
       res.status(400).send(e)
    }
})

router.delete('/tasks/:id',async (req, res)=>{
    const _id= req.params.id
    try{
        const task= await Task.findByIdAndDelete(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch{
        res.status(500).send()
    }
})

module.exports=router