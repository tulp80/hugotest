export const prerender = false;
const GOOGLE_CAPTCHA_SECRET 	= process.env.GOOGLE_CAPTCHA_SECRET;


export async function POST({ request }) {
	const data = await request.json();

	const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
	const requestHeaders = {
		'Content-Type': 'application/x-www-form-urlencoded'
	};
	const requestBody = new URLSearchParams({
		secret: GOOGLE_CAPTCHA_SECRET, // This can be an environment variable
		response: data.recaptcha // The token passed in from the client
	});

	const response = await fetch(recaptchaURL, {
		method: 'POST',
		headers: requestHeaders,
		body: requestBody.toString()
	});

	console.log('........');
	console.log(recaptchaURL, {
		method: 'POST',
		headers: requestHeaders,
		body: requestBody.toString()
	});

	const responseData = await response.json();

	return new Response(JSON.stringify(responseData), { status: 200 });
}
