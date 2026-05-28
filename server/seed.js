const mongoose = require("mongoose");
const Course = require("./models/Course");
require("dotenv").config();

const courses = [
  { title: "Machine Learning Fundamentals",       category: "AI",            tags: ["ai", "ml", "python"],          description: "Supervised & unsupervised learning with scikit-learn." },
  { title: "Deep Learning with TensorFlow",       category: "AI",            tags: ["ai", "deep learning", "neural networks"], description: "CNNs, RNNs, and transformer architectures." },
  { title: "Ethical Hacking & Penetration Testing", category: "Cybersecurity", tags: ["cybersecurity", "hacking", "security"], description: "Hands-on offensive security techniques." },
  { title: "Network Security Essentials",         category: "Cybersecurity", tags: ["cybersecurity", "networking", "firewall"], description: "Firewalls, IDS/IPS, and secure network design." },
  { title: "Threat Intelligence & OSINT",         category: "Cybersecurity", tags: ["cybersecurity", "osint", "threat"], description: "Gathering and analysing open-source threat data." },
  { title: "Data Science with Python",            category: "Data",          tags: ["data", "python", "pandas"],    description: "Pandas, NumPy, and real-world data pipelines." },
  { title: "Big Data & Apache Spark",             category: "Data",          tags: ["data", "spark", "hadoop"],     description: "Distributed data processing at scale." },
  { title: "Full Stack Web Development",          category: "Web",           tags: ["web", "react", "nodejs"],      description: "React, Node.js, and modern deployment practices." },
  { title: "React & TypeScript Masterclass",      category: "Web",           tags: ["web", "react", "typescript"],  description: "Build production-grade React apps with TypeScript." },
  { title: "Cloud Computing with AWS",            category: "Cloud",         tags: ["cloud", "aws", "devops"],      description: "Core AWS services, IAM, EC2, S3, and Lambda." },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Course.deleteMany({});
  await Course.insertMany(courses);
  console.log("✅ Seeded", courses.length, "courses");
  mongoose.connection.close();
}).catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});