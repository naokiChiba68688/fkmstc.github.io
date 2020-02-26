const myid = sessionStorage.getItem("myid")
var jsonPlayList;
var peer = new Peer(myid, { key: '12811376-9405-4d0c-bc52-1c95a4f4703f', debug: 3 });
var gettsFileResult;


//相手から接続された
peer.on('connection', dataConnection => {
	dataConnection.once('open', () => {
		console.log("相手から接続されました");
	})
	dataConnection.on('data', data => {
		console.log(data);
		addMessage(data[1]+"へ"+data[0]+"を送信");
		var xhr = new XMLHttpRequest();
		xhr.open("GET", sessionStorage.getItem(data[0]));
		xhr.send(null);
		xhr.responseType = "blob";
		xhr.onload = function () {
			dataConnection.send([data[0],xhr.response,myid]);
		}
	})
	dataConnection.once('close', () => {
		console.log("相手が接続を切りました");
	})
})


function getJsonPlayList() {
	$.getJSON("./hls/" + myid + ".json", function (data) {
		jsonPlayList = data;
		var promise = [];
		for (i = 0; i < jsonPlayList.objectList.length; i++) {
			/*
				tsFileName:tsファイルの名前
				folderName:フォルダの名前
				folderURL:上記の二つを使いリクエストのURLを作成
			*/
			var tsFileName = jsonPlayList.objectList[i].tsFileName;
			var folderName = tsFileName.substring(0, tsFileName.indexOf("_"));
			var folderURL = "./hls/" + folderName + "/" + tsFileName;
			//console.log("tsFileName:" + tsFileName + "\n" +"folderName:" + folderName + "\n" +"folderURL:" + folderURL);
			if ("Server" === jsonPlayList.objectList[i].URL) {
				//サーバからtsファイルを取得
				promise.push(gettsfile(folderURL, tsFileName));
				addMessage("Server : " + tsFileName);
			} else {
				//peerからtsファイルを取得
				promise.push(datasendFunction([jsonPlayList.objectList[i].URL, tsFileName,myid]));
			}
		}
		Promise.all(promise).then(function () {
			getm3u8File("./hls/BasePlayList.m3u8")
				.then(function () {
					for(i = 0; i < jsonPlayList.objectList.length; i++){
						console.log(jsonPlayList.objectList[i].tsFileName + ":" + sessionStorage.getItem(jsonPlayList.objectList[i].tsFileName))
					}
					setSource();
				});
		})
	});
}

function datasendFunction(data) {
	return new Promise(function (resolve) {
		var dataConnection = peer.connect(data[0]);
		dataConnection.once('open', () => {
			console.log("自分がpeerに接続しました");
			dataConnection.send([data[1],data[2]]);
		})
		dataConnection.on('data',data =>{
			console.log(data[1]);
			var blob = new Blob([data[1]], { type: "video/mp2t" });
			var url = URL.createObjectURL(blob);
			sessionStorage.setItem(data[0],url);
			addMessage(data[2]+"から"+data[0]+"を受信");
			resolve();
		})
	})
};
