export const handleSuccess = (name: string, message?: string) => {
	console.log(message ? `✅ ${name} success: ${message}` : `✅ ${name} success!`);
};

export const handleError = (name: string, message?: string) => {
	console.log(`❌ ${name}: ${message}`);
	console.log(message ? `❌ ${name} error: ${message}` : `❌ ${name} error!`);
};
