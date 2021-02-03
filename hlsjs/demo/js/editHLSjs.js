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

						/*
						peer.listAllPeers(peers => {
							console.log(peers)
						});
						*/

						//アクセス先のURLを動的変更
						context.url = `./hls/${USERJSON[count].dirName}/${USERJSON[count].tsFileName}`;
						// ./hls/  5min_PlayList1          / 5min_Ts010.ts
						//console.log(context.url)

						if (id == "peer13") {
							//とりあえず青色を取得
							context.url = `./hls/10min_PlayList1/${USERJSON[count].tsFileName}`;
						}

						if (true) {
							var onSuccess = callbacks.onSuccess;
							callbacks.onSuccess = function (response, stats, context) {
								//DOM表示
								//$("#info").html($("#info").html() + `Server:${USERJSON[count].dirName[13]}  ${USERJSON[count].tsFileName.substr(8, 12)}` + "<br>")
								$("#info").html($("#info").html() + `Server:${USERJSON[count].tsFileName.substr(8, 12)}` + "<br>")
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
						/*
						peer.listAllPeers(peers => {
							console.log(peers)
						});
						*/
						var tmp = USERJSON[count].URL;
						const peerList = tmp.split(",");




						peer.listAllPeers(peers => {
							num = -1;
							var flg = false;
							var svr = false;
							while (flg == false) {
								num += 1;
								if (peers.includes(peerList[num])) {
									flg = true;
									break;
								} else if (num > peerList.length) {
									flg = true;
									svr = true;
									USERJSON[count].URL = "Server"
									break;
								}
							}

							if (USERJSON[count].URL != "Server") {
								//data[0:相手のpeerid][1:tsファイル名][2:自分のpeerid][3:相手のピアのidの配列番号]
								PeerDataSendFunction([peerList[num], USERJSON[count].tsFileName, id])
									.then(function () {
										context.url = sessionStorage.getItem(USERJSON[count].tsFileName)
										console.log(peerList[num], "からのロードが完了したよ", context.frag.relurl)
										num = 0;
										load(context, config, callbacks);
									})
							} else {
								//とりあえず青色を取得
								context.url = `./hls/10min_PlayList1/${USERJSON[count].tsFileName}`;

								if (true) {
									var onSuccess = callbacks.onSuccess;
									callbacks.onSuccess = function (response, stats, context) {
										//DOM表示
										//$("#info").html($("#info").html() + `Server:${USERJSON[count].dirName[13]}  ${USERJSON[count].tsFileName.substr(8, 12)}` + "<br>")
										$("#info").html($("#info").html() + `Server:${USERJSON[count].tsFileName.substr(8, 12)}` + "<br>")
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
							}



							/*
							if (peers.includes(peerList[num]) == false) {
								num += 1;
								console.log("接続予定のピアがありません")
								load(context, config, callbacks);
							} else {
								if (num >= 3) {
									//全てのピアがなかった場合サーバから
									USERJSON[count].URL = "Server"
									load(context, config, callbacks);
								}
								//data[0:相手のpeerid][1:tsファイル名][2:自分のpeerid][3:相手のピアのidの配列番号]
								PeerDataSendFunction([peerList[num], USERJSON[count].tsFileName, id])
									.then(function () {
										context.url = sessionStorage.getItem(USERJSON[count].tsFileName)
										console.log(peerList[num], "からのロードが完了したよ", context.frag.relurl)
										num = 0;
										load(context, config, callbacks);
									})
							}
							*/
						});




					}

					this.abort = function () {
						console.log("ここに失敗したときの処理を書く")
						load(context, config, callbacks);
					};
				}
			}
		}


		var hls = new Hls({
			//"debug": true,
			"debug": false,
			fLoader: fLoader
		});
		var video = document.getElementById('video');
		hls.loadSource("./hls/BasePlayList2.m3u8");
		//hls.loadSource("./hls/BasePlayList.m3u8");
		hls.attachMedia(video);

		function onLevelLoaded(event, data) {
			console.log(hls.levels);
			var level_duration = data.details;
			console.log(level_duration)
		}

		function onBufferLoaded(event, data) {
			console.log(data.frag.relurl);
		}


		// subscribe event
		//hls.on(Hls.Events.LEVEL_LOADED, onLevelLoaded);
		//hls.on(Hls.Events.LEVEL_PTS_UPDATED, onLevelLoaded);
		//hls.on(Hls.Events.FRAG_LOADED , onBufferLoaded);
	}
};