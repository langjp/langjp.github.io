function webact( type )
	{var str=$ ( "#getCID" ).text ( );if ( str.match ( "正在" ) )
			{alert ( "正在获取CID！不要重复提交" );return;}
		var i="1";IID = type == "IID6" ?$ ( "#IID6" ).val ( ): $ ( "#IID7" ).val ( );if ( IID == null || IID == "" )
			{alert ( "安装ID不能为空！" );return;}
		IID = IID.replace ( /\-/g, '' );if ( IID.match ( "^[0-9]{54}$" ) || IID.match ( "^[0-9]{63}$" ) )
			{}
		else
			{alert ( "输入错误，请检查！" );return;}
		function doAjax( )
			{$.ajax ( {dataType:"json",cache:false,url:"http://www.aihao.cc/plugin.php?id=webact:getCID&IID=" + IID,beforeSend:function( xhr )
								 {$ ( "#getCID" ).html ( '<div class="alert alert-dismissable alert-success"><strong><img src="http://cdn.aihao.cc/5-1.gif"> 正在获取确认ID···</strong>' + i + '</div>' );},success:function( data )
								 {clearInterval ( int );if ( data [ "CID" ].match ( "[0-9\-]{55}" ) )
										 {$ ( "#getCID" ).html ( '<div class="alert alert-dismissable alert-success"><strong>获取成功！</strong><br><div class="input-group"><div class="input-group-addon">确认ID：</div><input type="text" class="form-control"  value="' + data [ "CID" ] + '"></div></div>' );}
									 else
										 {$ ( "#getCID" ).html ( '<div class="alert alert-dismissable alert-warning"><strong>' + data [ "CID" ] + '</strong></div>' );}},error:function( error )
								 {if ( i > 20 )
										 {clearInterval ( int );$ ( "#getCID" ).html ( '<div class="alert alert-dismissable alert-warning"><strong>无法获取确认ID！</strong>可能是服务器问题，请稍候重试...</div>' );}
									 i++;}} );}
		doAjax ( );int = self.setInterval ( function( )
{doAjax ( );}, 5000 );}
