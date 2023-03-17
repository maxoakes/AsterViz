import "dotenv/config";
import {Client} from "minio";

export const minioOptions = {
	endPoint: "127.0.0.1",
	port: 9000,
	useSSL: false,
	accessKey: "minioUser",
	secretKey: "minioPass",
}
export const minioClient = new Client(minioOptions);

export const UploadFileToMinio = async (filename: string, file: any): Promise<boolean> => {
	let success = false;
	try {
		await minioClient.putObject("asterviz", filename, file, (error: any, etag: any) => {
			if (error) {
				console.log("Minio client putObject failed: ", error);

				success=false;
			} else {
				console.log("Succesfully uploaded file");
				success=true;
			}
		});
	} catch (err) {
		console.log("In upload file to minio with err: ", err);
		success = false;
	}
	return success;
};

export const GetURLs = async (name: string): Promise<unknown> => {
	const objectsList = await new Promise((resolve, reject) => {
		const objectsListTemp: string[] = [];
		const stream = minioClient.listObjectsV2('asterviz', name, true, '');
		
		stream.on('data', obj => objectsListTemp.push('/asterviz/' + obj.name));
		stream.on('error', reject);
		stream.on('end', () => {
			resolve(objectsListTemp);
		});
	});
	return await objectsList;
};