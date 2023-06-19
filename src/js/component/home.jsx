import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

//create your first component
const Home = () => {

	const [inputValue, setInputValue] = useState("");
	const [task, setTask] = useState([]);
	const [hoverPosition, setHoverPosition] = useState(null);

	const postData = async (items) => {
		try {
			const url = `https://assets.breatheco.de/apis/fake/todos/user/albert`;
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(items)
			});

			if (!response.ok) {
				throw new Error('Error en la solicitud');
			}

			const data = await response.json();
			console.log('Respuesta:', data);
		} catch (error) {
			console.log('Error:', error);
		}
	};

	const createUser = async () => {
		try {
			const url = `https://assets.breatheco.de/apis/fake/todos/user/albert`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify([])
			});
			if (!response.ok) {
				throw new Error('Error request');
			}
			const data = await response.json();
			console.log('Response', data);
		} catch (error) {
			console.log('Error creating user. User already exists:', error);
		}
	};

	const getData = async () => {
		try {
			const response = await fetch(
				"https://assets.breatheco.de/apis/fake/todos/user/albert"
			);
			const data = await response.json();
			setTask(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {

		const fetchData = async () => {
			try {
				if (task.length === 0) {
					const response = await fetch(
						"https://assets.breatheco.de/apis/fake/todos/user/albert"
					);
					if (!response.ok) {
						throw new Error("Error retrieving data");
					}
					const data = await response.json();
					setTask(data);
				}
			} catch (error) {
				console.log(error);
			}
		};

		const createUserIfNeeded = async () => {
			try {
				const response = await fetch(
					"https://assets.breatheco.de/apis/fake/todos/user/albert"
				);
				if (response.status === 404) {
					await createUser();
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
		createUserIfNeeded();
	}, []);

	const validateInput = () => {
		if (inputValue === "") {
			alert("Don't be lazy. Add a task!");
			return false;
		}

		if (inputValue && inputValue[0] !== inputValue[0].toUpperCase()) {
			alert("The first letter must be capitalized. Grammar is important!");
			return false;
		}

		if (inputValue.length < 2) {
			alert("Minimum length is 2 characters. Don't be indolent!");
			return false;
		}

		return true;
	};

	const addTask = () => {
		if (validateInput()) {
			const newTask = { label: inputValue, done: false };
			const updatedTasks = [newTask, ...task.filter((task) => task.label !== "Sample Task")];
			setTask(updatedTasks);
			setInputValue("");
			postData(updatedTasks);
		}
	};

	const handleKeyPress = (event) => {

		if (event.key === 'Enter') {
			addTask();
		}
	};

	const deleteTask = async (index) => {
		const updatedTask = [...task];
		updatedTask.splice(index, 1);
		setTask(updatedTask);

		try {
			await postData(updatedTask);
		} catch (error) {
			console.log('Error:', error);
		}
	};


	return (
		<div className="text-center">
			<h1 className="mb-3">To Do List</h1>
			<input
				className="mb-3"
				type="text"
				onClick={addTask}
				onKeyUp={handleKeyPress}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
			/>

			{task.length === 0 ? (<p>No pending task, add task. Weekend is near!!!</p>) : (
				<ul style={{ listStyle: "none" }}>
					{task
						.filter((task) => task.label !== "Sample Task")
						.map((task, index) => (
							<li
								className="task-item"
								onMouseEnter={() => setHoverPosition(index)}
								onMouseLeave={() => setHoverPosition(null)}
								key={index}
							>
								{task.label}
								<button onClick={() => deleteTask(index)}>
									<FontAwesomeIcon icon={faTrash} />
								</button>
							</li>
						))}
					<span>
						<strong>{task.length}</strong> item left
					</span>
				</ul>
			)}
		</div>
	);
};


export default Home;
