# P2Pで著作権管理可能な動画配信システム([デモサイト](https://fkmstc.github.io/hlsjs/demo/))
一応このサイトでドキュメント化を行いたいと思います。  
以下に使用ライブラリのDocを貼ります。  
具体的な仕様については、そちらを参照するとより理解ができるかと思われます。  
* 使用ライブラリ
    * [HLS.js](https://github.com/video-dev/hls.js/)
    * [SkyWay](https://webrtc.ecl.ntt.com/api-reference/javascript.html)

* その他 自作のコード
    * [editHLSjs.js](./demo/js/editHLSjs.js)　(主にチャンク、プレイリストの操作を行っているJsファイル)
    * [skywayEdit.js](./demo/js/skywayEdit.js)　（主にピアの接続、チャンクのダウンロードを行っているファイル） 
<br> 

## 操作方法
* サイトを開きます。  
この時、**タブ**ではなく**ウインドウ**で開いてください。  
<img width="" alt="Window" src="./image/Window.png" style="max-width:500px;">
<br>

* IDをセットします。  
デモではpeer10,peer11,peer12,peer13を入力してください。  
peer13は恐らく最後に値をセットしないと、正常に動作しないと思われます。（他のピアからチャンクを取得するピアの為。)  
<br>
下記のようなエラーが出た場合、一度時間をおいてからリロードしてください。(既に他のページで入力したpeerIDが使用されている可能性があります。ご確認ください。)
![PeerError](./image/PeerError.png)  
動画が再生されれば成功です。
