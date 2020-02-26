$(function () {
	//現在のIDを表示
	$('#currentMyid').text(sessionStorage.getItem("myid"));
	//Jsonファイルを取得しTSファイルを取得
	//詳しくはpeerList.jsに
	$('#getJson').on('click', function () {
		var localmyid = sessionStorage.getItem("myid");
		sessionStorage.clear();
		sessionStorage.setItem("myid", localmyid);
		getJsonPlayList();
	})
});

//プレイヤーにソースの割り当て
function setSource() {
	var player = videojs($("#Videojs-id").get(0));
	player.src({
		//src: `data:application/vnd.apple.mpegurl;base64,${btoa(nowPlayListData.join('\n'))}`,
		src: sessionStorage.getItem("playlistURL"),
		type: "application/x-mpegurl",
	});
	addMessage("プレイリストを更新");
	//現在のプレイリストを表示 コンソールとHTML内に表示
	console.log(nowPlayListData);
	//videojs.options.hls.overrideNative = true;
	videojs.options.hls.overrideNative = !videojs.browser.IS_SAFARI;
	videojs.options.hls.nativeVideoTracks = videojs.browser.IS_SAFARI;
	videojs.options.hls.nativeAudioTracks = videojs.browser.IS_SAFARI;
	videojs.options.hls.nativeTextTracks = videojs.browser.IS_SAFARI;
	playlisttoHTML(nowPlayListData);
}

//HTMLに書き込む関数
function addMessage(data) {
	$(function () {
		$('#js-Messages-Text').append(data + "<br>");
	});
}

//playlistのHTML表示
function playlisttoHTML(data) {
	$(function () {
		$('#js-playlist-Text').text("");
		for (i = 0; i < data.length; i++) {
			$('#js-playlist-Text').append(data[i] + "<br>");
		}
	});
}
