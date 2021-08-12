/**********************************************************************************************************************************
Mathオブジェクト拡張ライブラリ
	Mathオブジェクトを拡張したライブラリ。

	作成履歴：
		2017/02/07	新規作成（浅野 利博）
		2017/02/08	減算関数を追加（浅野 利博）
		2017/02/09	指数形式浮動小数点チェック関数を追加（浅野 利博）
					乗算関数を追加（浅野 利博）
**********************************************************************************************************************************/

/*--------------------------------------------------------------------------------------------------------------
Mathオブジェクト拡張初期設定
--------------------------------------------------------------------------------------------------------------*/
var Math = Math || {};

/*--------------------------------------------------------------------------------------------------------------
数値->文字列変換関数
	浮動書数点にも対応した変換を行う。
	浮動小数点の指数形式も、小数点形式に変換された文字列となる。
	
	引数
		val		... 変換元数値
		
	戻り値
		変換結果数値文字列
		引数が数値でない場合には「NaN」が返される。

	Example:
		console.log( Math.toString( -123 ) );
		console.log( Math.toString( 123 ) );
		console.log( Math.toString( 0.00000000123 ) );
		console.log( Math.toString( 1.23E-9 ) );
		console.log( Math.toString( 5E+30 ) );
		console.log( Math.toString( -2e-11 ) );
		console.log( Math.toString( Number.MAX_VALUE ) );
		
	作成履歴
		2017/02/07	新規作成（浅野 利博）
		2017/02/09	NaNはtypeofでnumber扱いになるため修正。（浅野 利博）
					コメントの修正。（浅野 利博）
--------------------------------------------------------------------------------------------------------------*/
Math.toString = function( val )
{
	// 引数チェック
	if(
		( typeof val !== 'number' )
		||
		isNaN( val )
	)
	{
		return NaN;
	}

	// 数値を文字列化する。
	var target = String(val).toLowerCase();

	// 指数形式か否かチェック
	var right_val = target.split('e')[1];
	{
		// 指数形式の場合
		if( right_val )
		{
			var left_val = 0;
			var decomal_length = 0;
			// 指数部符号判定
			{
				// 「-」の場合
				if( parseFloat( right_val ) < 0 )
				{
					// 浮動小数点表記を解析
					left_val = target.split('e')[0];
					left_val = left_val.replace( '.', '' );
					var count = Math.abs( parseFloat( right_val ) ) - 1;
					var result = '0.';
					for( var i=0; i<count; i++ )
					{
						result += '0';
					}
					// もしマイナスの値の場合
					if( parseFloat( left_val ) < 0 )
					{
						left_val = left_val.replace( '-', '' );
						return '-' + result + left_val;
					}
					return result + left_val;
				// 「+」の場合
				} else {
					// 浮動小数点表記を解析
					left_val = target.split('e')[0];
					var decimal_length = String(left_val).toLowerCase().split('.')[1];
		
					var count = Math.abs( parseFloat( right_val ) );
					if( decimal_length )
					{
						count -= decimal_length.length;
					}
					var result = left_val.replace( '.', '' );
					for( var i=0; i<count; i++ )
					{
						result += '0';
					}
					return result;
				}
			}
		// 浮動小数点以外の場合
		} else {
			// 指定された数値を文字列化したものを返す。
			return target;
		}
	}
}

/*--------------------------------------------------------------------------------------------------------------
減算関数
	指数形式の浮動小数点にも対応した正しい減算を行う関数。
	
	引数
		val1	... 引かれる数値
		val2	... 引く数値
	
	戻り値
		「val1 - val2」の計算結果。
		引数が数値でない場合には「NaN」が返される。

	Example:
		console.log( 0.1 - 0.3 );
		console.log( Math.subtract( 0.1, 0.3 ) );
		
	作成履歴
		2017/02/08	新規作成（浅野 利博）
		2017/02/09	NaNはtypeofでnumber扱いになるため修正。（浅野 利博）
--------------------------------------------------------------------------------------------------------------*/
Math.subtract = function( val1, val2 )
{
	// 引数チェック
	if(
		( typeof val1 !== 'number' )
		||
		( typeof val2 !== 'number' )
		||
		isNaN( val1 )
		||
		isNaN( val2 )
	)
	{
		return NaN;
	}
	
	// 指定された引数の数値を小数点表記の数値文字列に変換する。
	var val_str1 = Math.toString( val1 );
	var val_str2 = Math.toString( val2 );

	// 小数点に応じた桁数を求める
	// 整数の場合には「１」となる。
	var decimal_length1 = val_str1.split( '.' );
	if( decimal_length1[1] )
	{
		decimal_length1 = Math.pow( 10, decimal_length1[1].length );
	} else {
		decimal_length1 = 1;
	}

	var decimal_length2 = val_str2.split( '.' );
	if( decimal_length2[1] )
	{
		decimal_length2 = Math.pow( 10, decimal_length2[1].length );
	} else {
		decimal_length2 = 1;
	}

	// 最大の桁数を求める
	var max_decimal_length = Math.max( decimal_length1, decimal_length2 );

	// 整数として引き算を行い、小数点を戻す。
	return( ( ( val1 * max_decimal_length ) - ( val2 * max_decimal_length ) ) / max_decimal_length );
}

/*--------------------------------------------------------------------------------------------------------------
指数形式浮動小数点チェック関数
	指定された値が、指数形式浮動小数点か？確認を行う関数。
	
	引数
		val		... 対象数値
	
	戻り値
		true	...	指数形式
		false	...	指数形式以外

	Example:
		console.log( Math.isExponential( 1.23e-9 ) );
		console.log( Math.isExponential( 100 ) );
		
	作成履歴
		2017/02/09	新規作成（浅野 利博）
--------------------------------------------------------------------------------------------------------------*/
Math.isExponential = function( val )
{
	// 引数チェック
	if(
		( typeof val !== 'number' )
		||
		isNaN( val )
	)
	{
		// 指数形式ではない
		return false;
	}

	// 指数形式の場合
	if( String(val).toLowerCase().split('e')[1] )
	{
		// 指数形式
		return true;
	}
	
	// 指数形式ではない
	return false;
}

/*--------------------------------------------------------------------------------------------------------------
乗算関数
	指数形式の浮動小数点にも対応した正しい乗算を行う関数。
	
	引数
		val1	... 乗算対象数値
		val2	... 乗算数値
	
	戻り値
		「val1 * val2」の計算結果。
		引数が数値でない場合には「NaN」が返される。

	Example:
		console.log( Math.multiplication( 123, 100 ) );
		console.log( Math.multiplication( 0.00000000123, 100 ) );
		console.log( Math.multiplication( 1.23e-9, 100 ) );
		
	作成履歴
		2017/02/09	新規作成（浅野 利博）
--------------------------------------------------------------------------------------------------------------*/
Math.multiplication = function( val1, val2 )
{
	// 引数チェック
	if(
		( typeof val1 !== 'number' )
		||
		( typeof val2 !== 'number' )
		||
		isNaN( val1 )
		||
		isNaN( val2 )
	)
	{
		return NaN;
	}

	// 指定された引数の数値を小数点表記の数値文字列に変換する。
	var val_str1 = Math.toString( val1 );
	var val_str2 = Math.toString( val2 );

	// 小数以下桁数の合計を計算
	var decimal_length1 = val_str1.split( '.' );
	if( decimal_length1[1] )
	{
		decimal_length1 = Math.pow( 10, decimal_length1[1].length );
	} else {
		decimal_length1 = 1;
	}

	var decimal_length2 = val_str2.split( '.' );
	if( decimal_length2[1] )
	{
		decimal_length2 = Math.pow( 10, decimal_length2[1].length );
	} else {
		decimal_length2 = 1;
	}

	var decimal_length = decimal_length1 * decimal_length2;
	if( decimal_length <= 0 )
	{
		decimal_length = 1;
	}

	// 小数点を取り除く
	val_str1 = parseFloat( val_str1.replace( '.', '' ) );
	val_str2 = parseFloat( val_str2.replace( '.', '' ) );

	// 掛け算を行い、小数点の桁数decimal_lengthの数だけ除算する
	return val_str1 * val_str2 / decimal_length;
}
