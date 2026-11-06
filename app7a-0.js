// CRUD operations of students table of school database

require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read HTML files from public folder
app.use(express.static("public"));

// Connection establishment with school database
const db = mysql.createConnection({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

db.connect((err) => {

    if (err) {
        console.log("MySQL Connection Failed:", err.message);
        return;
    }

    console.log("Connected to MySQL");

});

// TO GET DETAILS OF ALL STUDENTS
app.get("/students", (req, res) => {

    db.query(
        "SELECT * FROM student",
        (err, result) => {

            if (err) {
                res.status(500).send(err.message);
                return;
            }

            res.json(result);

        }
    );

});

// TO GET THE DETAILS OF ONE STUDENT
app.get("/students/:sno", (req, res) => {

    db.query(
        "SELECT * FROM student WHERE student_id=?",
        [req.params.sno],
        (err, result) => {

            if (err) {
                res.status(500).send(err.message);
                return;
            }

            res.json(result);

        }
    );

});

// TO INSERT STUDENT DATA INTO STUDENT TABLE
app.post("/students", (req, res) => {

    const { sno, name, studentClass, total } = req.body;

    db.query(
        "INSERT INTO student (student_id, student_name, `class`, total) VALUES (?, ?, ?, ?)",
        [sno, name, studentClass, total],
        (err) => {

            if (err) {
                res.status(500).send(err.message);
                return;
            }

            res.send("Student Inserted Successfully");

        }
    );

});

// TO UPDATE STUDENT DETAILS
app.put("/students/:sno", (req, res) => {

    const { name, studentClass, total } = req.body;

    db.query(
        "UPDATE student SET student_name=?, `class`=?, total=? WHERE student_id=?",
        [name, studentClass, total, req.params.sno],
        (err, result) => {

            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows == 0) {
                res.status(404).send("Student NOT found");
            }
            else {
                res.send("Student Updated Successfully");
            }

        }
    );

});

// TO DELETE STUDENT DETAILS
app.delete("/students/:sno", (req, res) => {

    db.query(
        "DELETE FROM student WHERE student_id=?",
        [req.params.sno],
        (err, result) => {

            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows == 0) {
                res.status(404).send("Student NOT found to delete");
            }
            else {
                res.send("Student Deleted Successfully");
            }

        }
    );

});

// SERVER TO LISTEN ON PORT NUMBER 3000
app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});