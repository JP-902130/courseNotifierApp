import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateCourse() {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    course: "",
    phoneNum: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const createCourse = (e) => {
    e.preventDefault();
    console.log(course);
    axios
      .post("/create", course)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    navigate("courses");
  };

  return (
    <div style={{ textAlign: "center", width: "90%", margin: "auto auto" }}>
      <h1>Create course page</h1>
      <Form>
        <Form.Group>
          <Form.Control
            name="course"
            value={course.course}
            onChange={handleChange}
            style={{ marginBottom: "1rem" }}
            placeholder="course"
          />
          <Form.Control
            onChange={handleChange}
            name="phoneNum"
            value={course.phoneNum}
            style={{ marginBottom: "1rem" }}
            placeholder="phoneNum"
          />
        </Form.Group>
        <Button
          onClick={createCourse}
          variant="outline-success"
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          CREATE COURSE
        </Button>
      </Form>
      <Button
        onClick={() => navigate("courses")}
        variant="outline-success"
        style={{ width: "100%" }}
      >
        ALL COURSES
      </Button>
    </div>
  );
}

export default CreateCourse;
