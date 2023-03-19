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

export const deleteAllMinioFiles = async (): Promise<any> => {
	let objectsList: string[] = []

	// List all object paths in bucket my-bucketname.
	let objectsStream = minioClient.listObjects('asterviz', '', true)

	objectsStream.on('data', function(obj) {
		objectsList.push(obj.name);
	})

	objectsStream.on('error', function(e) {
		console.log(e);
	})

	objectsStream.on('end', function()
	{
		minioClient.removeObjects('asterviz', objectsList, function(e) {
			if (e) {
				return console.log('Unable to remove Objects ',e)
			}
			console.log('Removed the objects successfully')
		})
	})
}