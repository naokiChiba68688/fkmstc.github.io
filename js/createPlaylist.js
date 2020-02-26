var nowPlayListData;

TextEncoder = function TextEncoder() {}
TextEncoder.prototype.encode = function(s) {
	const e = new Uint8Array(s.length);
	for (let i = 0; i < s.length; i += 1) {
		e[i] = s.charCodeAt(i);
	}
	return e;
}

//m3u8を取得
function getm3u8File(dir) {
	return new Promise(function (resolve) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", dir);
		xhr.send(null);
		xhr.responseType = "text";
		xhr.onload = function () {
			m3u8Parse(xhr.responseText.split("\n"));
			resolve();
		}
	});
}

//m3u8ファイルの操作
function m3u8Parse(data) {
	jsonNum = 0;
	for (i = 0; i < data.length; i++) {
		//"#"を含まない場合-1 
		if (data[i].indexOf("#") == -1) {
			//保存したURLを取得，URLをプレイリストにセット
			data[i] = sessionStorage.getItem(jsonPlayList.objectList[jsonNum].tsFileName);
			jsonNum++;
		}
	}
	nowPlayListData = data;
	var enc = new TextEncoder("utf-8");
	var blob = new Blob([enc.encode(data.join('\n'))], { type: "application/x-mpegurl" });
	var burl = URL.createObjectURL(blob);
	sessionStorage.setItem("playlistURL", burl);
}

function gettsfile(dir, name) {
	return new Promise(function (resolve) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", dir);
		xhr.send(null);
		xhr.responseType = "blob";
		xhr.onload = function () {
			var responseBlob = xhr.response;
			var url = URL.createObjectURL(responseBlob);
			sessionStorage.setItem(name, url);
			resolve();
		}
	});
}