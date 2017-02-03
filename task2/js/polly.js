//封装自己的函数库
;(function(){
	polly={
		trimAll:function(str,is_global){
	       	var result;
	       	result = str.replace(/(^\s+)|(\s+$)/g,"");
	       	if(is_global.toLowerCase()=="g")
	       	{
	           	result = result.replace(/\s/g,"");
	        	}
	       	return result;
		}, 	
		trimBetween:function(){
		},
		repeatArray:function(array){
			for(var k=0;k<array.length;k++)
			{
				for(var j=0;j<array.length;j++)
				{
					if(j!=k)
					{
						if(array[k]==array[j]){
							  array.splice(k,1);
						}
					}
				}
			}
			return array;
		}
	} 	
})()