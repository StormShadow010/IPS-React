// import React from 'react';
// import ReactDOM from 'react-dom/client';

export const loginData = async (data, url) => {
	try {
		let response = await fetch(`${url}`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		let res = await response.json()
		return (res)
	} catch (error) {
		console.log(error)
	}
}

export const addDataUser = async (data, url, token) => {
	try {
		let response = await fetch(`${url}`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `bearer ${token}`
			}
		})
		let res = await response.json()
		return (res)
	} catch (error) {
		console.log(error)
	}
}

export const addData = async (data, url, token) => {
	try {
		let response = await fetch(`${url}`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `bearer ${token}`
			}
		})
		let res = await response.json()
		return (res)
	} catch (error) {
		console.log(error)
	}
}

export const getData = async (url, token) => {
	try {
		let response = await fetch(`${url}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `bearer ${token}`
			}
		})
		let res = await response.json()
		return (res)
	} catch (error) {
		console.log(error)
	}
}

export const editData = async (data, url, token) => {
	try {
		let response = await fetch(`${url}`, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `bearer ${token}`
			}
		})
		let res = await response.json()
		return (res)
	} catch (error) {
		console.log(error)
	}
}

export const deleteData = async (url, token) => {
	try {
		let response = await fetch(`${url}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `bearer ${token}`
			}
		})
		let res = await response.status
		return (res)
	} catch (error) {
		console.log(error)
	}
}
