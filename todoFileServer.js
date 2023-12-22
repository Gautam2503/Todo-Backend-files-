const express = require('express');
  const bodyParser = require('body-parser');
  const fs = require('fs');
  const { all } = require('./solutions/todoServer.solution');

  const app = express();
  
  app.use(bodyParser.json());
  

  app.get("/todos" , (req,res) => {
    fs.readFile("todos.json" , "utf-8" , (err,data) => {
      if(err){
        res.status(404).json({msg : "Error reading file"})
      }
      res.send(data)
    })
  })

  app.get("/todos/:id" , (req,res) => {
    fs.readFile("todos.json" , "utf-8" , (err,data) => {
      if(err){
        res.status(404).json({msg : "Error reading file"})
      }
      const todos = JSON.parse(data);
      const todo = todos.find(t => t.id === parseInt(req.params.id));
      if(todo){
        res.send(todo);
      }
      else{
        res.status(400).json({msg : "No file"});
      }
    })
  })

  app.post("/todos" , (req,res) => {
    const newTodo = {
      id : 0,
      title : req.body.title,
      description : req.body.description
    }
    fs.readFile("todos.json" , "utf-8" , (err,data) =>{
      if(err){
        res.status(404).send("Errorr");
      }
      const OgTodo = JSON.parse(data);
      newTodo.id = OgTodo.length + 1;
      OgTodo.push(newTodo);

      fs.writeFile("todos.json" , JSON.stringify(OgTodo) , "utf-8" , (err) =>{
        if(err) {
          res.status(400).json({msg : "Error in writing the file"});
        }
        res.status(204).json({msg : "All done"});
      })
      res.json({msg : "All Done."});
    })
  })

  app.put("/todos/:id" , (req,res) => {
    const newTodo = {
      title  : req.body.title,
      description : req.body.description
    }

    fs.readFile("todos.json" , "utf-8" , (err,data) => {
      if(err){
        res.status(404).json({msg : "Error reading file"})
      }
      const todos = JSON.parse(data);
      const todo = todos.find(t =>  t.id === parseInt(req.params.id));
      if(todo){
        const id = parseInt(req.params.id);
        const finalTodo = edit(todos , id , newTodo);
        fs.writeFile("todos.json" , JSON.stringify(finalTodo) , "utf-8" , (err) => {
          if(err){
            res.json({msg:"Unsuccessful"});
          }
          res.json({msg : "ALL done"});
        })
      }
      else{
        res.status(404).json({msg : "Not found"});
      }
    })
  })
  app.delete("/todos/:id" , (req,res) => {
    fs.readFile("todos.json" , "utf-8" , (err,data) => {
      if(err){
        res.status(404).json({msg : "Error reading file"})
      }
      const todos = JSON.parse(data);
      const todo = todos.find(t =>  t.id === parseInt(req.params.id));
      if(todo){
        const id = parseInt(req.params.id);
        const finalTodo = del(todos , id );
        fs.writeFile("todos.json" , JSON.stringify(finalTodo) , "utf-8" , (err) => {
          if(err){
            res.json({msg:"Unsuccessful"});
          }
          res.json({msg : "ALL done"});
        })
      }
      else{
        res.status(404).json({msg : "Not found"});
      }
    })
  })



  function edit(todos , id , newTodo){
    const finalTodo = [];
    for(let i = 0 ; i<todos.length;i++){
      if(todos[i].id === id){
        const updatedTodo = {
          id : todos[i].id,
          title: newTodo ? newTodo.title : undefined,
          description: newTodo ? newTodo.description : undefined
        }
        console.log(updatedTodo.title);
        console.log(updatedTodo.description);
        finalTodo.push(updatedTodo);
      }
      else{
        finalTodo.push(todos[i]);
      }
    }
    return finalTodo;
  }

  function del(todos , id){
    const finalTodo = [];
    for(let i = 0 ; i<todos.length;i++){
      if(todos[i].id !== id){
        finalTodo.push(todos[i]);
      }
    }
    return finalTodo;
  }

app.listen(3004)