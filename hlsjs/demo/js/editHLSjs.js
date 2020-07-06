function newHls() {
	if (Hls.isSupported()) {
		class fLoader extends Hls.DefaultConfig.loader {
			constructor(config) {
				super(config);
				var load = this.load.bind(this);

				this.load = function (context, config, callbacks) {

					//tsファイルを探しだす
					var tsfilename = context.frag.relurl;
					//console.log(context);
					for (i = 0; i < USERJSON.length; i++) {
						if (tsfilename == USERJSON[i].tsFileName) {
							count = i;
							break;
						}
					}

					//サーバなら
					if (USERJSON[count].URL == "Server") {
						console.log("サーバからデータを取得")
						//console.log(context)

						//アクセス先のURLを動的変更
						context.url = `./hls/${USERJSON[count].dirName}/${USERJSON[count].tsFileName}`;
						// ./hls/  5min_PlayList1          / 5min_Ts010.ts
						//console.log(context.url)

						if (true) {
							var onSuccess = callbacks.onSuccess;
							callbacks.onSuccess = function (response, stats, context) {
								//DOM表示
								$("#info").html($("#info").html() + `Server:${USERJSON[count].dirName[13]}  ${USERJSON[count].tsFileName.substr(7, 12)}` + "<br>")
								//Server:1            ts_00x.ts

								//サーバから受け取った動画データ(response.data)に対しURLを発行 sessionストレージに保存
								//バイナリデータに変換
								var blob = new Blob([response.data], { type: "video/mp2t" })
								//セッションストレージに保存
								sessionStorage.setItem(USERJSON[count].tsFileName, URL.createObjectURL(blob));
								onSuccess(response, stats, context);
							}
						}
						load(context, config, callbacks);
					};

					//peerなら
					if (USERJSON[count].URL != "Server") {
						//data[0:相手のpeerid][1:tsファイル名][2:自分のpeerid]
						PeerDataSendFunction([USERJSON[count].URL, USERJSON[count].tsFileName, id])
							.then(function () {
								context.url = sessionStorage.getItem(USERJSON[count].tsFileName)
								load(context, config, callbacks);
							})
					}

					this.abort = function () {
						load(context, config, callbacks);
					};
				}
			}
		}


		var hls = new Hls({
			"debug": true,
			//"debug": false,
			fLoader: fLoader
		});
		var video = document.getElementById('video');
		hls.loadSource("./hls/BasePlayList2.m3u8");
		//hls.loadSource("./hls/BasePlayList.m3u8");
		hls.attachMedia(video);

		function onLevelLoaded(event, data) {
			var level_duration = data.details;
			console.log(level_duration)
		}
		// subscribe event
		hls.on(Hls.Events.LEVEL_LOADED, onLevelLoaded);
		hls.on(Hls.Events.LEVEL_PTS_UPDATED, onLevelLoaded);

	}
};