
class Student {
    // P1a: Constructor
    constructor(name, scores) {
      this.name = name;
      this.scores = scores;
    }
  
    // P1b: get average — uses a loop (no reduce)
    get average() {
      let sum = 0;
      for (let i = 0; i < this.scores.length; i++) {
        sum += this.scores[i];
      }
      return sum / this.scores.length;
    }
  
    // P1c: get letterGrade
    // Grading scale:
    //   90–100 → A
    //   80–89  → B
    //   70–79  → C
    //   60–69  → D
    //   below 60 → F
    get letterGrade() {
      const avg = this.average;
      if (avg >= 90) return "A";
      else if (avg >= 80) return "B";
      else if (avg >= 70) return "C";
      else if (avg >= 60) return "D";
      else return "F";
    }
  
    // P1d: summary() — finds highest and lowest with a loop (no Math.max/min)
    summary() {
      let highest = this.scores[0];
      let lowest = this.scores[0];
      for (let i = 1; i < this.scores.length; i++) {
        if (this.scores[i] > highest) highest = this.scores[i];
        if (this.scores[i] < lowest) lowest = this.scores[i];
      }
      return { highest, lowest };
    }
  }
  // P3b: getRemark — switch-based function
  
  function getRemark(grade) {
    switch (grade) {
      case "A": return "Outstanding";
      case "B": return "Above Average";
      case "C": return "Average";
      case "D": return "Needs Improvement";
      case "F": return "Failing";
      default:  return "Unknown Grade";
    }
  }
  
  // P3a + P3b + P3c: printReportCard — template literals only
  function printReportCard(student) {
    const avg = student.average;
    const grade = student.letterGrade;
    const { highest, lowest } = student.summary();
  
    // P3b: pass/fail via ternary (≥60 = PASS)
    const status = avg >= 60 ? "PASS" : "FAIL";
    const remark = getRemark(grade);
  
    // P3c: destructure scores into first, second, ...remaining
    const [score1, score2, ...remaining] = student.scores;
  
    console.log(`========== Report Card ==========`);
    console.log(`Name   : ${student.name}`);
    console.log(`Scores : ${student.scores.join(", ")}`);
    console.log(`  - Score 1 : ${score1}`);
    console.log(`  - Score 2 : ${score2}`);
    if (remaining.length > 0) {
      console.log(`  - Remaining: ${remaining.join(", ")}`);
    }
    console.log(`Average: ${avg.toFixed(1)}`);
    console.log(`Grade  : ${grade}`);
    console.log(`Status : ${status}`);
    console.log(`Remark : ${remark}`);
    console.log(`Highest: ${highest}`);
    console.log(`Lowest : ${lowest}`);
    console.log(`=================================`);
  }
  
  // P2a + P2b: Parse argv and validate

  const args = process.argv;
  
  // P2a: name from argv[2], scores from argv[3+], convert to numbers
  const name = args[2];
  const scores = args.slice(3).map(Number);
  
  // P2b: validate — need at least 3 scores
  if (scores.length < 3) {
    console.error("Error: Please provide a name and at least 3 scores.");
    console.error("Usage: node solution.js <name> <score1> <score2> <score3> ...");
    process.exit(1);
  }
  
  const student = new Student(name, scores);
  printReportCard(student);
  
 
  // BONUS:

  // Reads students.json and prints a report card for each student,
  // then identifies the top performer.
  // students.json format:
  // [
  //   { "name": "Alice", "scores": [85, 92, 78] },
  //   { "name": "Bob",   "scores": [70, 65, 80] }
  // ]
  //
  // To run: node solution.js --multi
  
  if (args[2] === "--multi") {
    const fs = require("fs");
  
    const raw = fs.readFileSync("students.json", "utf8");
    const data = JSON.parse(raw);
  
    const students = data.map(entry => new Student(entry.name, entry.scores));
  
    for (const s of students) {
      printReportCard(s);
    }
  
    // Find top performer using a loop
    let topStudent = students[0];
    for (let i = 1; i < students.length; i++) {
      if (students[i].average > topStudent.average) {
        topStudent = students[i];
      }
    }
  
    console.log(`\n Top Performer: ${topStudent.name} with an average of ${topStudent.average.toFixed(1)}`);
  }