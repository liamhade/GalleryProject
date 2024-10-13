class GalleryService {
	static instance: GalleryService

	async fetchImage(show_name: string, file_name: string) {
		const res = await fetch(`${process.env.NEXT_PUBLIC_HEROKU_BASE_URL}gallery/fetchImage/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application-json',
			},
			body: JSON.stringify({
				'show_name': show_name,
				'file_name': file_name,
			})
		});

		if (!res.ok) {
			throw new Error(`Response status: ${res.status}`);
		}
	  
		return res;
	}

	async postUserInfo({
		name, 
		email
	}: {
		name?: string, 
		email?: string
	}) {
		const res = await fetch(`${process.env.NEXT_PUBLIC_HEROKU_BASE_URL}gallery/handleUserInfo/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				'name': name,
				'email': email,
			})
		})

		if (!res.ok) {
			throw new Error(`Response status: ${res.status}`);
		}
	}

	async listShowImages(show_name: string): Promise<any> {
		
		const res = await fetch(`${process.env.NEXT_PUBLIC_HEROKU_BASE_URL}gallery/${show_name}`);

		if (!res.ok) {
			throw new Error(`Response status: ${res.status}`);
		}
	  
		return res;
	}

	async getState(): Promise<any> {
		const res = await fetch(`${process.env.NEXT_PUBLIC_HEROKU_BASE_URL}gallery/`);

		if (!res.ok) {
			throw new Error(`Response status: ${res.status}`);
		}
	  
		return res;
	}
}

export default new GalleryService();