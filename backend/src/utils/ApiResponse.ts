

class ApiResponse {
	statusCode: number
	message: string
	status: boolean
	data: any

	constructor(
		statusCode = 200,
		message = "successfully fetched endpoint",
		status = true,
		data: any
	) {
		this.statusCode = statusCode;
		this.message = message;
		this.status = status;
		this.data = data;
	}

	toString() {
		return {
			"statusCode": this.statusCode,
			"message": this.message,
			"data": this.data,
			"status": this.status
		};
	}
};

export {
	ApiResponse
};