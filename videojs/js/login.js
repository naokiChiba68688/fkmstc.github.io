$(function () {
	$('#login').on('click',function(){
		let myid = $("#my-peer-id-input").val()
		if(myid === ""){
			alert("idを入力してください");
		}else{
			sessionStorage.setItem("myid",myid);
			window.location.href = "./Main.html";
		}
	});
});