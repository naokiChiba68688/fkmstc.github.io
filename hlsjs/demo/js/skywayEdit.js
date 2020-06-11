//data[0:tsファイル名][1:自分のpeerid]
//相手から接続された
function  PeerDataReceiveFunction(){
	peer.on('connection', dataConnection => {
		dataConnection.once('open', () => {
			console.log("相手から接続されました");
		})
		dataConnection.on('data', data => {
			//DOM表示
			$("#info").html($("#info").html() + data[1] + "へ" + data[0].substr( 7, 12 ) + "を送信<br>");
			var xhr = new XMLHttpRequest();
			xhr.open("GET", sessionStorage.getItem(data[0]));
			xhr.send(null);
			xhr.responseType = "blob";
			xhr.onload = function () {
				
				dataConnection.send([data[0], xhr.response, id]);
			}
		})
		dataConnection.once('close', () => {
			console.log("相手が接続を切りました");
		})
	})
}

//data[0:相手のpeerid][1:tsファイル名][2:自分のpeerid]
function PeerDataSendFunction(data) {
	return new Promise(function (resolve) {
		console.log(`${data[0]}へ接続`)
		var dataConnection = peer.connect(data[0]);
		dataConnection.once('open', () => {
			console.log("自分がpeerに接続しました");
			dataConnection.send([data[1], data[2]]);
		})
		dataConnection.on('data', data => {
			console.log(data[1]);
			var blob = new Blob([data[1]], { type: "video/mp2t" });
			var url = URL.createObjectURL(blob);
			sessionStorage.setItem(data[0], url);
			$("#info").html($("#info").html() + data[2] + ":" + data[0].substr( 7, 12 ) + "<br>");
			resolve();
		})
	})
};