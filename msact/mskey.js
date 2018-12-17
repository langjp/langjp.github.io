function mskey( type )
	{var str=$ ( "#checkResult" ).text ( );if ( str.match ( "正在" ) )
			{alert ( "正在检测！不要重复提交" );return;}
		var i="1";KEY = type == "Office" ?$ ( "#KEY1" ).val ( ): $ ( "#KEY2" ).val ( );if ( KEY == null || KEY == "" )
			{alert ( "密钥不能为空！" );return;}
		if ( !KEY.match ( "^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$" ) )
			{alert ( "输入错误，请检查！" );return;}
		function doAjax( )
			{$.ajax ( {dataType:"json",cache:false,url:"http://www.aihao.cc/plugin.php?id=mskey:checkResult&KEY=" + KEY + "&type=" + type,beforeSend:function( xhr )
								 {$ ( "#checkResult" ).html ( '<div class="alert alert-dismissable alert-success"><strong><img src="http://cdn.aihao.cc/5-1.gif"> 正在检测···</strong>' + i + '</div>' );},success:function( data )
								 {clearInterval ( int );if ( data [ "errCode" ] && data [ "activCount" ] )
										 {$ ( "#checkResult" ).html ( '<div class="alert alert-dismissable alert-success"><img src="http://key.aihao.cc/key.php?t=' + new Date ( ).getTime ( ) + '&key=' + data [ "KEY" ] + '.png" class="img-responsive"></div>' );}
									 else
										 {$ ( "#checkResult" ).html ( '<div class="alert alert-dismissable alert-warning"><strong>' + data [ "error" ] + '</strong></div>' );}},error:function( error )
								 {if ( i > 18 )
										 {clearInterval ( int );$ ( "#checkResult" ).html ( '<div class="alert alert-dismissable alert-warning"><strong>没有检测结果！</strong>可能是服务器问题，请稍候重试...</div>' );}
									 i++;}} );}
		doAjax ( );int = self.setInterval ( function( )
											   {doAjax ( );}, 10000 );}
