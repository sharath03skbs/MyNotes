const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
 

// Route 1 : Get All the notes using : GET "api/notes/fetchallnotes" . Login required
router.get("/fetchallnotes",fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({user:req.user.id});
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2 : Adding a new Note using : POST "api/notes/addnote" . Login required
router.post("/addnote",fetchuser,[
  body("title", "Enter a valid title").isLength({ min: 3 }),
  body("description", "Description must be atleast 5 characters").isLength({ min: 5 }),
], async (req, res) => {
  try {
    const {title,description,tag} = req.body;
    const errors = validationResult(req);
    //If there are errors return bad request and errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,description,tag,user:req.user.id
      })
      const savedNote = await note.save()
    res.json(savedNote);    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 3 : Update an existing Note using : PUT "api/notes/updatenote" . Login required
router.put("/updatenote/:id",fetchuser, async (req, res) => {
  const {title,description,tag} = req.body;
  try {
    
    //Creating a new note object
    const newNote = {};
    if(title) {newNote.title = title}
    if(description) {newNote.description = description}
    if(tag) {newNote.tag = tag}
  
    //Finding the existing note object to be updated and update it 
    let note = await Note.findById(req.params.id);
  
    if(!note){return res.status(404).send("Not Found");}
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not Allowed")
    }
    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
    res.json({note});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
  
});

// Route 4 : Delete an existing Note using : DELETE "api/notes/deletenote" . Login required
router.delete("/deletenote/:id",fetchuser, async (req, res) => {
  
  try {
    //Finding the existing note object to be deleted and delete it 
    let note = await Note.findById(req.params.id);
  
    if(!note){return res.status(404).send("Not Found");}
    //Allow deletion only if the user owns this note
  
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not Allowed")
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({"Success" : "Note with this Id has been Deleted", note:note});
    } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
  
});

module.exports = router;
