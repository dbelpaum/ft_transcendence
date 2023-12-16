import {  Store } from 'react-notifications-component';

export const showNotificationSuccess = ( title: string, message: string ) => {
	Store.addNotification({
		title: title,
		message: message,
		type: 'success',
		insert: "top",
		container: "top-right",
		animationIn: ["animate__animated", "animate__fadeIn"],
		animationOut: ["animate__animated", "animate__fadeOut"],
		dismiss: {
			duration: 5000,
			onScreen: true,
			showIcon: true,
		}
	});
}

export const showNotificationError = ( title: string, message: string ) => {
	Store.addNotification({
		title: title,
		message: message,
		type: 'danger',
		insert: "top",
		container: "top-right",
		animationIn: ["animate__animated", "animate__fadeIn"],
		animationOut: ["animate__animated", "animate__fadeOut"],
		dismiss: {
			duration: 10000,
			onScreen: true,
			showIcon: true
		}
	});
}

export const showNotificationWarning = ( title: string, message: string ) => {
	Store.addNotification({
		title: title,
		message: message,
		type: 'warning',
		insert: "top",
		container: "top-right",
		animationIn: ["animate__animated", "animate__fadeIn"],
		animationOut: ["animate__animated", "animate__fadeOut"],
		dismiss: {
			duration: 5000,
			onScreen: true,
			showIcon: true
		}
	});
}